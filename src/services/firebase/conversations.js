import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth";

export const conversationListener = (listener, groupsIDS) => {
  firestore()
  .collection("groups")
  .where("id", "in", groupsIDS)
  .orderBy('modifiedAt', 'desc')
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

export const sendMessage = async (messageDetails, threadId) => {
    await firestore().collection("messages").doc(threadId).collection("messages").add(messageDetails);
    await firestore().collection("groups").doc(threadId).update({
      recentMessage: {
        readBy: {
          [messageDetails.sentBy]: true,
        },
        ...messageDetails
      }
    });
}