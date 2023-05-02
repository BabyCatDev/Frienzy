import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export function deleteAction() {
  return {
    type: "Delete",
    payload: null,
  };
}

export function deleteUser() {
  return async (dispatch) => {
    try {
      let user = auth().currentUser;
      const id = user.uid;
      user.delete().then(() => {
        firestore()
        .collection("users")
        .doc(id)
        .set({
          deleted: Date.now().toString(),
          loggedIn: false,
        }, {merge: true});
      })
      await dispatch(deleteAction());
    } catch (error) {
      Alert.alert("", "Check your internet connection, Try Again");
    }
  };
}
