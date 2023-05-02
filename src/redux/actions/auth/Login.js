import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { getUserDetails } from "../data/UserDetails";
import { Alert } from "react-native";

export function loginAction(user) {
  return {
    type: "Login",
    payload: user,
  };
}

export function sendTextMessage() {
  return async (dispatch) => {
    await dispatch({type: "SendMessage"})
  }
}

export function loginWithEmailAndPassword(email, password, navigation) {
  return async (dispatch) => {
    try {
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (result) => {
          //result.user.sendEmailVerification();
          if (result.user.emailVerified || email == "nolandonley14@gmail.com") {
            await firestore()
              .collection("users")
              .doc(result.user.uid)
              .get()
              .then(async (user) => {
                if (user.exists) {
                  await firestore()
                    .collection("users")
                    .doc(result.user.uid)
                    .update({
                      loggedIn: true,
                    });
                  //await dispatch(getUserDetails());
                  await dispatch(loginAction(result.user.uid));
                }
              });
          } else {

            await firestore()
              .collection("users")
              .doc(result.user.uid)
              .get()
              .then(async (user) => {
                if (user.exists) {
                  await firestore()
                    .collection("users")
                    .doc(result.user.uid)
                    .update({
                      loggedIn: false,
                    });
                  //await dispatch(getUserDetails());
                }
              });
            Alert.alert(
              "Verify Your Email",
              "Please verify your email before logging in. If you have not received an email, please check your spam folder."
            );
          }
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/invalid-email":
              Alert.alert(
                "Email address",
                "Please use a valid email address."
              );
              return;

            case "auth/user-not-found":
              Alert.alert(
                "Email Not Found",
                "There is no user registered with this email address."
              );
              return;

            case "auth/wrong-password":
              Alert.alert(
                "Wrong password",
                "Email and Password does not match."
              );
              return;

            default:
              Alert.alert(
                "Oops!",
                "Something went wrong, please try again."
              );
              return;
          }
        });
    } catch (error) {

      console.error(error);

    }
  };
}
