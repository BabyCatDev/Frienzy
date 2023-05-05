import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export function userDetailsAction(details) {
  return {
    type: 'GetUserDetails',
    payload: details,
  };
}

const getAllUsers = async () => {
  const snapshot = await firestore().collection('users').get();
  const usersArray = snapshot.docs.map((doc) => doc.data());
  const usersWithMobile = usersArray.filter((user) => user.mobile !== undefined);
  return usersWithMobile.map((user) => {
    return { mobile: user.mobile, uid: user.uid };
  });
};

export function getUserProfileCompletedLevel(details) {
  let countCompleted = 0;
  if (details.firstname?.length > 0) {
    countCompleted += 1;
  }
  if (details.lastname?.length > 0) {
    countCompleted += 1;
  }
  if (details.username?.length > 0) {
    countCompleted += 1;
  }
  if (details.aboutMe?.length > 0) {
    countCompleted += 1;
  }
  if (details.address1?.length > 0) {
    countCompleted += 1;
  }
  if (details.mobile?.length > 0) {
    countCompleted += 1;
  }
  if (details.interests?.length > 0) {
    countCompleted += 1;
  }
  if (details.instaId || details.twitterId || details.tiktokId || details.youtubeId) {
    countCompleted += 1;
  }
  if (details.profileImage) {
    countCompleted += 1;
  }
  return Math.ceil((countCompleted * 100) / 9);
}

export const userAuthStateListener = () => (dispatch) => {
  auth().onAuthStateChanged((user) => {
    if (user) {
      dispatch(getUserDetails());
      //dispatch(getPostsByUser(firebase.auth().currentUser.uid))
    } else {
      dispatch({ type: 'UserStateChange', currentUser: null, loaded: true });
    }
  });
};

export const getUserDetails = () => (dispatch) => {
  firestore()
    .collection('users')
    .doc(auth().currentUser.uid)
    .onSnapshot((res) => {
      console.log('Here on update');
      if (res.exists) {
        dispatch(getUserFriends());
        dispatch(getUserInvites());
        return dispatch({
          type: 'UserStateChange',
          userData: res.data(),
          loaded: true,
        });
      }
    });
};

export const getUserFriends = () => (dispatch) => {
  firestore()
    .collection('users')
    .doc(auth().currentUser.uid)
    .collection('friends')
    .onSnapshot((querySnap) => {
      let friends = [];
      querySnap.forEach((docSnap) => {
        friends.push({ id: docSnap.id, data: docSnap.data() });
      });
      console.log('Friends', friends);
      return dispatch({
        type: 'UserFriendsChange',
        friendsData: friends,
      });
    });
};

export const getUserInvites = () => (dispatch) => {
  firestore()
    .collection('users')
    .doc(auth().currentUser.uid)
    .collection('invites')
    .onSnapshot((querySnap) => {
      let invites = [];
      querySnap.forEach((docSnap) => {
        invites.push({ id: docSnap.id, data: docSnap.data() });
      });
      console.log('Invites', invites);
      return dispatch({
        type: 'UserInvitesChange',
        invitesData: invites,
      });
    });
};
