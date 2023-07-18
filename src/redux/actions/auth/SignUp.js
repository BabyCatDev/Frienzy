import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { updateMyPendingGroups } from '../../../services/firebase/user';

export function signInUpAction(user) {
  return {
    type: 'SignInUp',
    payload: user,
  };
}

async function createFirebaseUser(user, token) {
  const newData = {
    phone: user.phoneNumber,
    uid: user.uid,
    loggedIn: true,
    profileCompleted: false,
    friends: [],
    invites: [],
    location: [],
    groups: [],
    profilePic: '',
    name: '',
    fcm_token: token,
  };
  await firestore().collection('users').doc(auth().currentUser.uid).set(newData);
  await updateMyPendingGroups(user.phoneNumber);
}

export function signInUpWithPhone(confirmFunc, code) {
  return async (dispatch) => {
    try {
      await confirmFunc.confirm(code).then(async (userIn) => {
        const additionalUserDetails = userIn.additionalUserInfo;
        const userData = userIn.user;
        const token = await messaging().getToken();

        if (additionalUserDetails.isNewUser) {
          console.log('New User');
          await createFirebaseUser(userData, token);
        } else {
          console.log('Existing User');
          await firestore().collection('users').doc(auth().currentUser.uid).update({
            fcm_token: token,
            loggedIn: true,
          });
          await updateMyPendingGroups(userData.phoneNumber);
        }
        await dispatch(signInUpAction(userData.uid));
      });
    } catch (error) {
      console.error(error);
    }
  };
}
