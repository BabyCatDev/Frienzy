import BackgroundGeolocation, { Location, Subscription } from 'react-native-background-geolocation';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const locationListener = (listener, userId) => {
  firestore()
    .collection('users')
    .doc(userId)
    .collection('location')
    .orderBy('time', 'desc')
    .limit(1)
    .onSnapshot((docSnap) => {
      return listener(docSnap);
    });
};

export const groupListener = (listener, groupId) => {
  firestore()
    .collection('users')
    .where('groups', 'array-contains', groupId)
    .onSnapshot((docSnap) => {
      return listener(docSnap);
    });
};

export const saveUserLocation = async (location, time) => {
  const updatedLocation = {
    ...location,
    time: time,
  }
  await firestore()
    .collection('users')
    .doc(auth().currentUser.uid)
    .collection('location')
    .add({
      ...location,
    });
  await firestore().collection('users').doc(auth().currentUser.uid).update({
    currentLocation: updatedLocation
  });
};

