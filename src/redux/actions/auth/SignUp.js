import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";

export function signInUpAction(user) {
  return {
    type: "SignInUp",
    payload: user,
  };
}

async function createFirebaseUser(user) {
  const newData = {
    phone: user.phoneNumber,
    uid: user.uid,
    loggedIn: true,
    profileCompleted: false,
    friends: [],
    invites: [],
    location: [],
    groups: [],
    profilePic: "",
    name: "",
  }
  await firestore().collection("users").doc(auth().currentUser.uid).set(newData);
}

export function signInUpWithPhone(confirmFunc, code) {
  return async (dispatch) => {
    try {
      await confirmFunc.confirm(code).then(async (userIn) => {
        const additionalUserDetails = userIn.additionalUserInfo
        const userData = userIn.user;

        if (additionalUserDetails.isNewUser) {
          createFirebaseUser(userData)
        } else {
          await firestore().collection("users").doc(auth().currentUser.uid).update({ loggedIn: true });
        }
        await dispatch(signInUpAction(userData.uid))
      })
    } catch (error) {

      console.error(error);

    }
  };
}
