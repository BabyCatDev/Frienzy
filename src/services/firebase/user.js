import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

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
  } else {
    //const userData = await getUserDetails()
    await firestore().collection('users').doc(auth().currentUser.uid).update({ loggedIn: true });
  }
};

export const getUserDetails = async () => {
  const details = await firestore().collection('users').doc(auth().currentUser.uid).get();
  return details;
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

export const getGroupsForUser = async (groups) => {
  try {
    const groupsData = [];
    for (const group of groups) {
      console.log(group);
      const temp = await firestore().collection('groups').doc(group).get();
      groupsData.push(temp.data());
    }
    return groupsData;
  } catch (e) {
    console.log(e);
  }
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
  }
};

// Optimize func below to get 10 latest groups members

export const getAllMembersInUsersGroups = async (groupsIds, userId) => {
  try {
    const friends = [];
    for (const groupId of groupsIds) {
      const groupData = await firestore().collection('groups').doc(groupId).get();
      const mems = groupData.data().members;
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
