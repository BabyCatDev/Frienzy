import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  RefreshControl,
  useWindowDimensions,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { getMobileNumber } from '../../utils/helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/Colors';
import { Header } from '../../components/utils/Header';
import { AppStyles } from '../../utils/AppStyles';
import normalize from 'react-native-normalize';
import SearchField from '../../components/utils/SearchField';
import ContactItem from './ContactItem';
import { MainButton } from '../../components/utils/MainButton';

import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { getContacts } from '../../utils/helper';
import { useSelector } from 'react-redux';
import ContactListComponent from './ContactListComponent';

const ContactList = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const userDetails = useSelector((state) => state.FrienzyAuth.userDetails);
  const [inviteList, setInviteList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [selectedContactList, setSelectedContactList] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState({});
  let selectedContactListPreload = {};
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [loading, setLoading] = useState(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getContacts(userDetails, setInviteList, setContactList, setFriendList, SortArray, setLoading);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const filteredItems = useMemo(() => {
    const filtered = inviteList?.filter((item) => {
      return (
        item.givenName.toLowerCase().includes(query.toLowerCase()) ||
        item.familyName.toLowerCase().includes(query.toLowerCase())
      );
    });
    // const filteredNonSelected = filtered?.filter((item) => {
    //   return selectedContactList[item.recordID] !== true;
    // });

    // const filteredSelected = filtered?.filter((item) => {
    //   return selectedContactList[item.recordID] === true;
    // });
    return filtered;
  }, [query, inviteList]);

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
    const translateY = interpolate(scrollY.value, [0, 50], [0, -50], Extrapolation.CLAMP);
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
    // const xSelected = selectedContactListPreload[x.recordID] == true;
    // const ySelected = selectedContactListPreload[y.recordID] == true;

    // if (xSelected && !ySelected) {
    //   return -1;
    // }
    // if (!xSelected && ySelected) {
    //   return 1;
    // }
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

  console.log('contactList', selectedContactList);

  const sharePressed = () => {
    // add selectedContact to selectedContactList
    setSelectedContactList((prevState) => {
      const newState = { ...prevState, [selectedContact.recordID]: true };
      AsyncStorage.setItem('selectedContactList', JSON.stringify(newState), () => {
        // update the counter after the state is updated
        let counter = 0;
        for (let key in newState) {
          if (newState[key] == true) {
            counter++;
          }
        }
        AsyncStorage.setItem('counter', JSON.stringify(counter));
      });
      return newState;
    });
    setIsChange(!isChange);
  };

  useEffect(() => {
    async function onStart() {
      await getContacts(
        userDetails,
        setInviteList,
        setContactList,
        setFriendList,
        SortArray,
        setLoading
      );
    }
    onStart();
  }, []);

  return (
    <LinearGradient
      colors={Colors.backgroundGradient}
      style={{ flex: 1, paddingTop: height * 0.08, paddingHorizontal: 20 }}
    >
      {filteredItems?.length == 0 &&
        (loading ? (
          <Text
            style={{
              ...AppStyles.medium22,
              ...AppStyles.notFoundPlaceholder,
              top: (height - 2 * normalize(33)) / 2,
            }}
          >
            {'Getting your contacts'}
          </Text>
        ) : (
          <Text
            style={{
              ...AppStyles.medium22,
              ...AppStyles.notFoundPlaceholder,
              top: (height - 2 * normalize(33)) / 2,
            }}
          >
            {'Nothing found'}
          </Text>
        ))}

      <Animated.ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={'#FFAE7C'}
            enabled={true}
            colors={['white', 'blue', 'red']}
          />
        }
        keyboardDismissMode={'on-drag'}
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
          <Header
            navigation={navigation}
            title={'Contacts'}
            containerStyle={{ marginBottom: 20 }}
          />
          <SearchField search={query} setSearch={setQuery} />
        </Animated.View>

        <ContactListComponent filteredItems={filteredItems} />
      </Animated.ScrollView>
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              You are about to share your location with{' '}
              {`${selectedContact.givenName} ${selectedContact.familyName}`}. Would you like to
              proceed?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{ backgroundColor: 'red', padding: 10 }}
                onPress={toggleModal}
              >
                <Text style={{ color: 'white' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: 'green', padding: 10 }}
                onPress={() => {
                  if (!selectedContactList[selectedContact.recordID] == true) {
                 
                  }
                  toggleModal();
                  sharePressed();
                }}
              >
                <Text style={{ color: 'white' }}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <MainButton
        title={'CONTINUE'}
        containerStyle={{
          position: 'absolute',
          bottom: 90,
          alignSelf: 'center',
        }}
        onPress={() => {
          navigation.push('Map');
        }}
      />
    </LinearGradient>
  );
};

export default ContactList;
