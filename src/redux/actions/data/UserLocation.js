import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const setLocationEnabled = (isEnabled) => (dispatch) => {
  firestore().collection('users').doc(auth().currentUser.uid).update({
    trackingOn: isEnabled,
  });
  return dispatch({
    type: 'SetUserLocationEnabled',
    isEnabled: isEnabled,
  });
};

export const setLocation = (location) => (dispatch) => {
  return dispatch({
    type: 'SetUserLocation',
    location: location,
  });
};

export const setGroupLocations = (locations) => (dispatch) => {
  return dispatch({
    type: 'SetGroupLocation',
    groupLocations: locations,
  });
};
