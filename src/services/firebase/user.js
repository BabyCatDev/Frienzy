import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

export const createUser = async (authResult) => {
  const additionalUserDetails = authResult.additionalUserInfo;
  const user = authResult.user;

  if (additionalUserDetails.isNewUser) {
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
    };
    await firestore().collection('users').doc(auth().currentUser.uid).set(newData);
    await updateMyPendingGroups(user.phoneNumber);
  } else {
    //const userData = await getUserDetails()
    await firestore().collection('users').doc(auth().currentUser.uid).update({ loggedIn: true });
  }
};

export const updateMyPendingGroups = (phoneNumber) =>
  new Promise((resolve, reject) => {
    const uid = auth().currentUser.uid;
    var groups = [];
    firestore()
      .collection('groups')
      .where('pending', 'array-contains', phoneNumber)
      .get()
      .then(async (querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          groups.push(documentSnapshot.data());
        });
        let groupIds = groups.map((g) => g.id);
        groups.forEach(async (group) => {
          await firestore()
            .collection('groups')
            .doc(group.id)
            .update({
              members: firestore.FieldValue.arrayUnion(uid),
            });
        });
        await firestore().collection('users').doc(uid).update({
          groups: groupIds,
        });
      })
      .catch(() => reject());
  });

export const getUserDetails = async () => {
  const details = await firestore().collection('users').doc(auth().currentUser.uid).get();
  return details;
};

export const updateUserName = async (name) => {
  const userref = await firestore().collection('users').doc(auth().currentUser.uid);
  userref.update({
    name: name,
  });
};

export const getUserById = (docID) =>
  new Promise((resolve, reject) => {
    firestore()
      .collection('users')
      .doc(docID)
      .get()
      .then((snapshot) => {
        resolve(snapshot.exists ? snapshot.data() : null);
      })
      .catch(() => reject());
  });

export const getUsersByPhoneList = (phoneList) =>
  new Promise((resolve, reject) => {
    var users = [];
    firestore()
      .collection('users')
      .where('phone', 'in', phoneList)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          users.push(documentSnapshot.data());
        });
        resolve(querySnapshot.exists ? users : null);
      })
      .catch(() => reject());
  });

export const getUserByPhone = (phone) =>
  new Promise((resolve, reject) => {
    var users = [];
    firestore()
      .collection('users')
      .where('phone', '==', phone)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          users.push(documentSnapshot.data());
        });
        resolve(querySnapshot.size > 0 ? users : null);
      })
      .catch(() => reject());
  });

export const saveNameAndPhoto = async (uid, photoURL, username) => {
  try {
    const filename = photoURL?.substring(photoURL?.lastIndexOf('/') + 1);
    const reference = storage().ref(`ProfilePhotos/${uid}/${filename}`);
    await reference.putFile(photoURL);
    const url = await storage().ref(`ProfilePhotos/${uid}/${filename}`).getDownloadURL();
    await firestore().collection('users').doc(uid).update({
      profilePic: url,
      name: username,
      profileCompleted: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getGroupsForUser = (groups, onIsCompletedChange) => {
  console.log('--------groups----------', groups);
  return new Promise((resolve, reject) => {
    try {
      const groupsData = [];
      const resolvedPromises = [];
      const promises = groups.map((group) => {
        return new Promise((resolve, reject) => {
          const docRef = firestore().collection('groups').doc(group);
          const unsubscribe = docRef.onSnapshot(
            (doc) => {
              if (doc.exists) {
                groupsData.push(doc.data());
                resolve();
              } else {
                reject(`Document does not exist: '${group}'`);
              }
            },
            (error) => {
              reject(error);
            }
          );
          docRef.onSnapshot((snapshot) => {
            const isCompleted = snapshot.data().isCompleted;

            const index = groupsData.findIndex((item) => item.id === group);
            console.log('-----------heyhey1--', index);

            if (index !== -1) {
              groupsData[index].isCompleted = isCompleted;

              // Invoke the callback function when isCompleted changes
              onIsCompletedChange(group, isCompleted);
            }
          });
        }).then(() => {
          resolvedPromises.push(group);
          if (resolvedPromises.length === groups.length) {
            resolve(groupsData);
          }
        });
      });
      Promise.all(promises).then(() => {
        resolve(groupsData);
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

export const getFriendsForUser = async (friendsIDS) => {
  try {
    const friends = [];
    for (const friend of friendsIDS) {
      const temp = await firestore().collection('users').doc(friend).get();
      friends.push(temp.data());
    }
    return friends;
  } catch (e) {
    console.log(e);
    return null;
  }
};

// Optimize func below to get 10 latest groups members

export const getAllMembersInUsersGroups = async (groupsIds, userId) => {
  try {
    const friends = [];
    for (const groupId of groupsIds) {
      const groupData = await firestore().collection('groups').doc(groupId).get();
      const mems = groupData.data()?.members ?? [];
      for (const mem of mems) {
        friends.indexOf(mem) === -1 && friends.push(mem);
      }
    }
    console.log('InAllMems', friends);
    return friends;
  } catch (e) {
    console.log(e);
  }
};

export const updateFcmToken = async () => {
  try {
    if (auth().currentUser == null) return;

    const token = await messaging().getToken();
    await firestore().collection('users').doc(auth().currentUser.uid).update({
      fcm_token: token,
    });
  } catch (error) {
    console.error(error);
  }
};

export const loadAllUsers = async () => {
  try {
    if (auth().currentUser == null) return null;

    const querySnapshot = await firestore().collection('users').get({
      source: 'server',
    });
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const removeFriendsFromGroup = async (groupId, friendsIdList) => {
  const groupRef = firestore().collection('groups').doc(groupId);
  const groupData = await groupRef.get();
  const currentMembers = groupData.data()?.members || [];
  const newMembers = currentMembers.filter((member) => !friendsIdList.includes(member));

  await groupRef.update({
    members: newMembers,
  });
  try {
    friendsIdList.map(async (item) => {
      const friendRef = firestore().collection('users').doc(item);
      const friendData = await friendRef.get();
      const currentGroups = friendData.data()?.groups || [];
      const newgroups = currentGroups.filter((member) => !groupId == member);
      await friendRef.update({
        groups: newgroups,
      });
    });
  } catch (error) {
    console.log(error);
  }
};
