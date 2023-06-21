import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

export const conversationListener = (listener, groupsIDS) => {
  const chunkSize = 10; // Maximum number of elements per query
  const chunks = [];

  // Divide the groupsIDS array into smaller chunks
  for (let i = 0; i < groupsIDS.length; i += chunkSize) {
    chunks.push(groupsIDS.slice(i, i + chunkSize));
  }

  // Perform multiple queries for each chunk of group IDs
  const unsubscribeCallbacks = chunks.map((chunk) => {
    return firestore()
      .collection('groups')
      .where('id', 'in', chunk)
      .orderBy('modifiedAt', 'desc')
      .onSnapshot((res) => {
        return listener(res);
      });
  });

  // Return an array of unsubscribe functions
  return () => {
    unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
  };
};

export const threadListener = (listener, threadId) => {
  firestore()
    .collection('groups')
    .doc(threadId)
    .collection('messages')
    .orderBy('sentAt', 'asc')
    .onSnapshot((res) => {
      console.log(res);
      return listener(res);
    });
};

export const getGroupById = (threadId) =>
  new Promise((resolve, reject) => {
    firestore()
      .collection('groups')
      .doc(threadId)
      .get()
      .then((snapshot) => {
        resolve(snapshot.exists ? snapshot.data() : null);
      })
      .catch(() => reject());
  });

export const sendMessage = async (messageDetails, threadId) => {
  console.log(threadId, messageDetails);
  await firestore().collection('groups').doc(threadId).collection('messages').add(messageDetails);
  await firestore()
    .collection('groups')
    .doc(threadId)
    .update({
      recentMessage: {
        readBy: {
          [messageDetails.sentBy]: true,
        },
        ...messageDetails,
      },
    });
};
export const getPreDefinedGroup = () => {
  return firestore()
    .collection('groups')
    .doc();
}
export const createNewGroup = async ({ group, name, pic, startDate, endDate, description, location, members, message = null }) => {
  const currentId = auth().currentUser.uid;
  const time = firestore.FieldValue.serverTimestamp();

  if (group === null)
    group = getPreDefinedGroup();

  var messageToAdd = {};

  if (message == null) {
    messageToAdd.text = `Welcome to your new frienzy -> ${name}. We just wanted to pop in to say hi, were not actually in this group.\n- Frienzy Team`;
    messageToAdd.sentBy = 'frienzy';
    messageToAdd.sentAt = time;
    messageToAdd.readBy = {};
  } else {
    messageToAdd.text = message.text;
    messageToAdd.sentBy = message.sentBy;
    messageToAdd.sentAt = message.sentAt;
    messageToAdd.readBy = {};
  }

  await group
    .set({
      name: name,
      members: [...members, currentId],
      startDate: startDate,
      endDate: endDate,
      description: description,
      location: location,
      createdBy: currentId,
      createdAt: time,
      modifiedAt: time,
      recentMessage: messageToAdd,
    });

  const filename = pic?.substring(pic?.lastIndexOf('/') + 1);
  const reference = storage().ref(`GroupPhotos/${group.id}/${filename}`);
  await reference.putFile(pic);
  const url = await storage().ref(`GroupPhotos/${group.id}/${filename}`).getDownloadURL();

  await firestore().collection('groups').doc(group.id).collection('messages').add(messageToAdd);
  await firestore().collection('groups').doc(group.id).update({ id: group.id, pic: url });

  await firestore()
    .collection('users')
    .doc(currentId)
    .update({
      groups: firestore.FieldValue.arrayUnion(group.id),
    });

  for (const mem of members) {
    await firestore()
      .collection('users')
      .doc(mem)
      .update({
        groups: firestore.FieldValue.arrayUnion(group.id),
      });
  }
};

export const addUserToGroup = async (threadId, userId, ownerId) => {
  console.log(threadId, userId, ownerId);
  await firestore()
    .collection('users')
    .doc(userId)
    .update({
      friends: firestore.FieldValue.arrayUnion(ownerId),
      groups: firestore.FieldValue.arrayUnion(threadId),
    });

  await firestore()
    .collection('groups')
    .doc(threadId)
    .update({
      members: firestore.FieldValue.arrayUnion(userId),
    });

  await firestore()
    .collection('users')
    .doc(ownerId)
    .update({
      friends: firestore.FieldValue.arrayUnion(userId),
    });
};

export const removeUserFromGroup = async (threadId, userId) => {
  await firestore()
    .collection('users')
    .doc(userId)
    .update({
      groups: firestore.FieldValue.arrayRemove(threadId),
    });

  await firestore()
    .collection('groups')
    .doc(threadId)
    .update({
      members: firestore.FieldValue.arrayRemove(userId),
    });
};
