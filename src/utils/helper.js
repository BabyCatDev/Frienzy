import { Platform, PermissionsAndroid } from "react-native";
import { storeObject, getObject } from "./AsyncStore";
import Contacts from "react-native-contacts";
import { getImgXtension, findImageInCache, cacheImage } from "./CacheImage";
import RNFS from 'react-native-fs';


export const getMobileNumber = (item) => {
  if (item?.phoneNumbers.length == 1) {
    return item?.phoneNumbers[0]?.number;
  } else {
    const mobile = item?.phoneNumbers.find((b) => b.label === "mobile");
    return mobile?.number ?? item?.phoneNumbers[0]?.number;
  }
};

export async function getContacts(setContacts, SortArray) {
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
          setContacts(contacts);
          storeObject("contacts", contacts);
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
      setContacts(contacts.sort(SortArray));
      storeObject("contacts", contacts);
    } catch (error) {
      console.log(error);
    }
  }
}

export const onContactPress = (
  { item, state },
  selectedContactList,
  onRefresh
) => {
  selectedContactList[item?.recordID] = state;
  // count how many trues are in selectedContactList
  let counter = 0;
  for (let key in selectedContactList) {
    if (selectedContactList[key] == true) {
      counter++;
    }
  }
  storeObject("counter", counter);
  storeObject("selectedContactList", selectedContactList);
  onRefresh((prev) => !prev);
};

export async function setSelectedContacts(
  selectedContactListPreload,
  setSelectedContactList
) {
  const value = await getObject("selectedContactList");
  if (value !== null) {
    selectedContactListPreload = value;
    setSelectedContactList(value);
  }
}

export async function loadImg(uri, cacheKey) {
  let imgXt = getImgXtension(uri);
  if (!imgXt || !imgXt.length) {
    console.error(`Couldn't load Image:`, cacheKey);
    // setUri(require('../../assets/imgs/emrgUserMarker.png'))
    return;
  }
  const cacheFileUri = `${RNFS.CachesDirectoryPath}/${cacheKey}.${imgXt[0]}`;
  let imgXistsInCache = await findImageInCache(cacheFileUri);
  if (imgXistsInCache.exists) {
    console.log("already cached: ", cacheFileUri);
    // setUri(getPlatformURI(cacheFileUri));
  } else {
    let cached = await cacheImage(uri, cacheFileUri, () => {});
    if (cached.cached) {
      console.log("cached new image:", uri);
      // setUri(getPlatformURI(cacheFileUri));
    } else {
      console.error(`Couldn't load Image:`, cacheKey);
      // setUri(require('../../assets/imgs/emrgUserMarker.png'))
    }
  }
}