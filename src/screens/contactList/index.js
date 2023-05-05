import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  RefreshControl,
  useWindowDimensions,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { getMobileNumber } from "../../utils/helper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../utils/Colors";
import { Header } from "../../components/Header";
import { AppStyles } from "../../utils/AppStyles";
import normalize from "react-native-normalize";
import SearchField from "../../components/SearchField";
import ContactItem from "./ContactItem";
import { MainButton } from "../../components/MainButton";

import FGLocationRetriever from "../../services/FGLocationRetriever";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { getContacts } from "../../utils/helper";

const ContactList = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const [contactList, setContactList] = useState([]);
  const [selectedContactList, setSelectedContactList] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState({});
  let selectedContactListPreload = {};
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isChange, setIsChange] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getContacts(
      setContactList,
      SortArray,
      selectedContactListPreload,
      setSelectedContactList
    );
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const filteredItems = useMemo(() => {
    const filtered = contactList?.filter((item) => {
      return (
        item.givenName.toLowerCase().includes(query.toLowerCase()) ||
        item.familyName.toLowerCase().includes(query.toLowerCase())
      );
    });
    const filteredNonSelected = filtered?.filter((item) => {
      return selectedContactList[item.recordID] !== true;
    });

    const filteredSelected = filtered?.filter((item) => {
      return selectedContactList[item.recordID] === true;
    });
    return [...filteredSelected, ...filteredNonSelected];
  }, [query, contactList]);

  const dispatch = useDispatch();

  const scrollY = useSharedValue(0);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const animatedStyles = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 50], [1, 0], {
      extrapolateRight: Extrapolation.CLAMP,
    });
    const translateY = interpolate(
      scrollY.value,
      [0, 50],
      [0, -50],
      Extrapolation.CLAMP
    );
    return {
      opacity: opacity,
      transform: [
        {
          translateY: translateY,
        },
      ],
    };
  });

  function SortArray(x, y) {
    // if x is in selectedContactList, then x should be first
    const xSelected = selectedContactListPreload[x.recordID] == true;
    const ySelected = selectedContactListPreload[y.recordID] == true;

    if (xSelected && !ySelected) {
      return -1;
    }
    if (!xSelected && ySelected) {
      return 1;
    }
    return x.givenName.localeCompare(y.givenName);
  }
  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  console.log("contactList", selectedContactList);

  const sharePressed = () => {
    // add selectedContact to selectedContactList
    setSelectedContactList((prevState) => {
      const newState = { ...prevState, [selectedContact.recordID]: true };
      AsyncStorage.setItem(
        "selectedContactList",
        JSON.stringify(newState),
        () => {
          // update the counter after the state is updated
          let counter = 0;
          for (let key in newState) {
            if (newState[key] == true) {
              counter++;
            }
          }
          AsyncStorage.setItem("counter", JSON.stringify(counter));
        }
      );
      return newState;
    });
    setIsChange(!isChange);
  };

  useEffect(() => {
    async function onStart() {
      await getContacts(
        setContactList,
        SortArray,
        selectedContactListPreload,
        setSelectedContactList
      );
    }
    onStart();
  }, []);

  return (
    <LinearGradient
      colors={Colors.backgroundGradient}
      style={{ flex: 1, paddingTop: height * 0.08, paddingHorizontal: 20 }}
    >
      {filteredItems?.length == 0 && (
        <Text
          style={{
            ...AppStyles.medium22,
            ...AppStyles.notFoundPlaceholder,
            top: (height - 2 * normalize(33)) / 2,
          }}
        >
          {"Nothing found"}
        </Text>
      )}

      <Animated.ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"#FFAE7C"}
            enabled={true}
            colors={["white", "blue", "red"]}
          />
        }
        keyboardDismissMode={"on-drag"}
        onScroll={scrollHandler}
        scrollEventThrottle={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: normalize(100),
        }}
      >
        <Animated.View
          style={{
            ...animatedStyles,
          }}
        >
          <Header navigation={navigation} title={"Contacts"} />
          <SearchField search={query} setSearch={setQuery} />
        </Animated.View>
        <View
          style={{
            ...AppStyles.listContainer,
            justifyContent: filteredItems?.length ? "flex-start" : "center",
          }}
        >
          {filteredItems?.length
            ? filteredItems.map((contact, index) => {
                return (
                  <ContactItem
                    key={index}
                    item={contact}
                    index={index}
                    onPress={({ item }) => {
                      if (selectedContactList[item.recordID] == true) {
                        setSelectedContactList((prevState) => ({
                          ...prevState,
                          [item.recordID]: false,
                        }));
                        AsyncStorage.setItem(
                          "selectedContactList",
                          JSON.stringify({
                            ...selectedContactList,
                            [item.recordID]: false,
                          })
                        );
                        let counter = Object.values({
                          ...selectedContactList,
                          [item.recordID]: false,
                        }).filter((value) => value)?.length;
                        AsyncStorage.setItem(
                          "counter",
                          JSON.stringify(counter)
                        );
                        return;
                      }
                      setSelectedContact(item);
                      setShowModal(true);
                    }}
                    check={selectedContactList[contact.recordID] == true}
                  />
                );
              })
            : null}
        </View>
      </Animated.ScrollView>
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View style={{ backgroundColor: "white", padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              You are about to share your location with{" "}
              {`${selectedContact.givenName} ${selectedContact.familyName}`}.
              Would you like to proceed?
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={{ backgroundColor: "red", padding: 10 }}
                onPress={toggleModal}
              >
                <Text style={{ color: "white" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: "green", padding: 10 }}
                onPress={() => {
                  if (!selectedContactList[selectedContact.recordID] == true) {
                    FGLocationRetriever.getInstance().addPhoneToTrack(
                      getMobileNumber(selectedContact)
                    );
                    FGLocationRetriever.getInstance().allowPhoneToTrackMe(
                      getMobileNumber(selectedContact)
                    );
                  }
                  toggleModal();
                  sharePressed();
                }}
              >
                <Text style={{ color: "white" }}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <MainButton
        title={"CONTINUE"}
        containerStyle={{
          position: "absolute",
          bottom: 90,
          alignSelf: "center",
        }}
        onPress={() => {
          navigation.push("Map");
        }}
      />
    </LinearGradient>
  );
};

export default ContactList;
