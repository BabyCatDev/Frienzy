import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Platform,
  useWindowDimensions,
  PermissionsAndroid,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Contacts from "react-native-contacts";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../utils/Colors";
import { Header } from "../profile/Header";
import { AppStyles } from "../../utils/AppStyles";
import Assets from "../../assets";
import normalize from "react-native-normalize";
import SearchField from "./SearchField";
import ContactItem from "./ContactItem";
import { MainButton } from "../../components/main_button";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { setFirstLaunch } from "../../store/slices/AuthSlice";
import { storeSharedLocation } from "../../store/slices/ShareLocationSlice";
import store from "../../store";

const ContactList = ({ navigation }) => {
  const { height } = useWindowDimensions();
  // const { shareLocations } = useSelector((state) => state.shareLocation);
  const [contactList, setContactList] = useState([]);
  const [selectedContactList, setSelectedContactList] = useState({});
  let selectedContactListPreload = {};
  const [query, setQuery] = useState("");

  const [isChange, setIsChange] = useState(false);

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

  const [selectAll, setSelectAll] = useState(undefined);
  const dispatch = useDispatch();

  const scrollY = useSharedValue(0);

  useEffect(() => {
    console.log("useEffect");
      AsyncStorage.getItem("selectedContactList").then(
        (value) => {
          if (value !== null) {
            selectedContactListPreload = JSON.parse(value);
            setSelectedContactList(JSON.parse(value));
          }
        }
      );
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      //console.log(scrollY.value, "scrollY.value");
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
    const xSelected = (selectedContactListPreload[x.recordID] == true)
    const ySelected = (selectedContactListPreload[y.recordID] == true)

    console.log("selectedContactList", selectedContactListPreload)
    
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
  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };
  async function getContacts() {
    if (Platform.OS === "android") {
      const andoidContactPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: "Contacts Permission",
          message: "This app would like to view your contacts.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (andoidContactPermission === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Contacts Permission granted");
        Contacts.getAll()
          .then((contacts) => {
            setContactList(contacts);
            storeData("contacts", contacts);
            storeData("counter", 0);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        console.log("Contacts permission denied");
      }
    } else {
      try {
        const contacts = await Contacts?.getAll();
          setContactList(contacts.sort(SortArray));
        storeData("contacts", contacts);
        storeData("counter", 0);
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    async function setContacts() {
      if (contactList?.length == 0) {
        const contacts = await getData("contacts");
        if (contacts !== null) {
          setContactList(contacts);
        } else {
          getContacts();
        }
        console.log(contactList, "contacts");
      }
    }
    setContacts();
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
        keyboardDismissMode={"on-drag"}
        onScroll={scrollHandler}
        scrollEventThrottle={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: normalize(100),
        }}
        // keyboardShouldPersistTaps={"handled"}
      >
        <Animated.View
          style={{
            ...animatedStyles,
          }}
        >
          <Header
            navigation={navigation}
            title={"Contacts"}
          />
          <SearchField search={query} setSearch={setQuery} />
        </Animated.View>
        <View
          style={{
            ...AppStyles.listContainer,
            justifyContent: filteredItems.length ? "flex-start" : "center",
          }}
        >
          {filteredItems.length
            ? filteredItems.map((contact, index) => {
                return (
                  <ContactItem
                    key={index}
                    item={contact}
                    index={index}
                    onPress={({item, state}) => {
                      console.log(state)
                      selectedContactList[contact.recordID] = state;

                      // vount how many trues are in selectedContactList
                      let counter = 0;
                      for (let key in selectedContactList) {
                        if (selectedContactList[key] == true) {
                          counter++;
                        }
                      }

                      AsyncStorage.setItem("counter", JSON.stringify(counter));

                      AsyncStorage.setItem(
                        "selectedContactList",
                        JSON.stringify(selectedContactList)
                      );
                            
                          setIsChange(!isChange);
                            //setSelectedContactList(selectedContactList);

                            //contactList.sort(SortArray);
                            
                          
                        
                        
                    }}
                    // permit={shareLocations[`${contact.recordID}`]}
                    check={selectedContactList[contact.recordID] == true}
                  />
                );
              })
            : null}
        </View>
      </Animated.ScrollView>
      <MainButton
        title={"CONTINUE"}
        containerStyle={{
          position: "absolute",
          bottom: height * 0.06,
          alignSelf: "center",
        }}
        onPress={() => {
          dispatch(setFirstLaunch());
          // store.dispatch(storeSharedLocation(shareLocations));
          navigation.push("Map");
        }}
      />
    </LinearGradient>
  );
};

export default ContactList;
