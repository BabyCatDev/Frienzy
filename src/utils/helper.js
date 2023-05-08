import { Platform, PermissionsAndroid } from 'react-native';
import { storeObject, getObject } from './AsyncStore';
import Contacts from 'react-native-contacts';
import { getImgXtension, findImageInCache, cacheImage } from './CacheImage';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserById, getUserByPhone, getUsersByPhoneList } from '../services/firebase/user';

export const getMobileNumber = (item) => {
  if (item?.phoneNumbers?.length == 1) {
    return item?.phoneNumbers[0]?.number;
  } else {
    const mobile = item?.phoneNumbers.find((b) => b.label === 'mobile');
    return mobile?.number ?? item?.phoneNumbers[0]?.number;
  }
};

export async function getContacts(
  userDetails,
  setInviteList,
  setContactList,
  setFriendList,
  SortArray,
  setLoading
) {
  if (Platform.OS === 'android') {
    const andoidContactPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts Permission',
        message: 'This app would like to view your contacts.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    if (andoidContactPermission === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Contacts Permission granted');
      Contacts.getAll()
        .then(async (contacts) => {
          //await setSelectedContacts(selectedContactListPreload, setSelectedContactList, contacts);
          setContactsList(contacts.sort(SortArray));
          storeObject('contacts', contacts);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.log('Contacts permission denied');
    }
  } else {
    try {
      const contacts = await Contacts?.getAll();

      var invites = [];
      var toAdd = [];
      var friends = [];

      for (let contact of contacts) {
        const num = contact.phoneNumbers[0].number.replace(/\D/g, '');
        const numWithCC = num.length == 11 ? `+${num}` : `+1${num}`;
        const user = await getUserByPhone(numWithCC);
        if (user == null) {
          invites.push(contact);
        } else {
          if (userDetails.friends.includes(user[0].uid)) {
            friends.push(user[0]);
          } else {
            toAdd.push(user[0]);
          }
        }
      }

      console.log('Friends', friends);
      console.log('\n\nTo Add', toAdd);
      console.log('\n\nInvites', invites);

      //await setSelectedContacts(selectedContactListPreload, setSelectedContactList, contacts);
      setContactList(toAdd);
      setFriendList(friends);
      setInviteList(invites.sort(SortArray));
      setLoading(false);
      //storeObject('contacts', contacts);
    } catch (error) {
      console.log(error);
    }
  }
}

export const onContactPress = ({ item, state }, selectedContactList, onRefresh) => {
  selectedContactList[item?.recordID] = state;
  // count how many trues are in selectedContactList
  let counter = 0;
  for (let key in selectedContactList) {
    if (selectedContactList[key] == true) {
      counter++;
    }
  }
  storeObject('counter', counter);
  storeObject('selectedContactList', selectedContactList);
  onRefresh((prev) => !prev);
};

export async function setSelectedContacts(
  selectedContactListPreload,
  setSelectedContactList,
  contacts
) {
  const value = await getObject('selectedContactList');
  // const contacts = await getObject("contacts");
  if (value !== null) {
    let selected = {};
    let counter = 0;
    for (let i = 0; i < contacts?.length; i++) {
      if (value[contacts[i].recordID] !== undefined) {
        selected[contacts[i].recordID] = value[contacts[i].recordID];
      }
      if (value[contacts[i].recordID] == true) {
        counter++;
      }
    }
    storeObject('counter', counter);
    selectedContactListPreload = selected;
    setSelectedContactList(selected);
  }
}

export async function loadImg(uri, cacheKey) {
  let imgXt = getImgXtension(uri);
  if (!imgXt || !imgXt?.length) {
    console.error(`Couldn't load Image:`, cacheKey);
    // setUri(require('../../assets/imgs/emrgUserMarker.png'))
    return;
  }
  const cacheFileUri = `${RNFS.CachesDirectoryPath}/${cacheKey}.${imgXt[0]}`;
  let imgXistsInCache = await findImageInCache(cacheFileUri);
  if (imgXistsInCache.exists) {
    console.log('already cached: ', cacheFileUri);
    // setUri(getPlatformURI(cacheFileUri));
  } else {
    let cached = await cacheImage(uri, cacheFileUri, () => {});
    if (cached.cached) {
      console.log('cached new image:', uri);
      // setUri(getPlatformURI(cacheFileUri));
    } else {
      console.error(`Couldn't load Image:`, cacheKey);
      // setUri(require('../../assets/imgs/emrgUserMarker.png'))
    }
  }
}
