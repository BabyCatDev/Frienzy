import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';


export const createItineraryItem = async (groupId, itineraryItem) => {
    const groupRef = firestore().collection('groups').doc(groupId);
    const itineraryItemsRef = groupRef.collection('itineraryItems');
  
    const newItineraryItemRef = await itineraryItemsRef.add(itineraryItem);
    return newItineraryItemRef.id;
  };


  export const getItineraryItemsForGroup = async (groupId) => {
    const groupRef = firestore().collection('groups').doc(groupId);
    const itineraryItemsRef = groupRef.collection('itineraryItems');
  
    const snapshot = await itineraryItemsRef.get();
    const itineraryItems = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    console.log('itinerary items for group', itineraryItems)
    return itineraryItems;
  }

  export const addPhotoToItinerary = async (userId, group, pic) => {
    try {
      const filename = pic?.substring(pic?.lastIndexOf('/') + 1);
      const reference = storage().ref(`SharedPhotos/${group.id}/${filename}`);
      console.log("addPhotoToItinerary: start putFile");
      await reference.putFile(pic);
      console.log("addPhotoToItinerary: end putFile");
      const url = await storage().ref(`SharedPhotos/${group.id}/${filename}`).getDownloadURL();
      console.log("addPhotoToItinerary: getDownloadURL", url);

      if (group.photos) {
        await firestore()
          .collection('groups')
          .doc(group.id)
          .update({
            photos: firestore.FieldValue.arrayUnion({
              owner: userId,
              url: url
            })
          });
      } else {
        await firestore()
          .collection('groups')
          .doc(group.id)
          .set({
            photos: [{
              owner: userId,
              url: url
            }]
          }, {
            merge: true
          });
      }
    } catch (e) {
      console.error(e);
    }
  }