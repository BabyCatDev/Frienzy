import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const conversationListener = (listener, groupsIDS) => {
  firestore()
    .collection('groups')
    .where('id', 'in', groupsIDS)
    .orderBy('modifiedAt', 'desc')
    .onSnapshot((res) => {
      return listener(res);
    });
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

export const createNewGroup = async ({ name, pic, members, message = null }) => {
  const currentId = auth().currentUser.uid;
  const time = firestore.FieldValue.serverTimestamp();

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

  const group = await firestore()
    .collection('groups')
    .add({
      name: name,
      pic: pic,
      members: [...members, currentId],
      createdBy: currentId,
      createdAt: time,
      modifiedAt: time,
      recentMessage: messageToAdd,
    });

  await firestore().collection('groups').doc(group.id).collection('messages').add(messageToAdd);
  await firestore().collection('groups').doc(group.id).update({ id: group.id });

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
