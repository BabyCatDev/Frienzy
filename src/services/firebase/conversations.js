import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";

export const conversationListener = (listener, userID) => {
  firestore()
  .collection("groups")
  .where("members", "array-contains", userID)
  .onSnapshot(listener)
}

export const threadListener = (listener, threadId) => {
  firestore()
  .collection("messages")
  .doc(threadId)
  .collection("messages")
  .orderBy('sentAt', 'asc')
  .onSnapshot(listener)
}