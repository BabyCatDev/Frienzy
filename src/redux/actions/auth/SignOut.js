import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export function signOutAction() {
  return {
    type: "SignOut",
    payload: null,
  };
}

export function signOut() {
  return async (dispatch) => {
    try {
      if (auth().currentUser.isAnonymous) {
        await firestore().collection('users').doc(auth().currentUser.uid).delete();
        await auth().currentUser.delete();
        await dispatch(signOutAction());
      } else {
        await firestore().collection('users').doc(auth().currentUser.uid).update({ loggedIn: false });
        auth().signOut()
          .then(async () => {
            await dispatch(signOutAction())
          });
      }

    } catch (error) {
      console.error(error);
    }
  };
}
