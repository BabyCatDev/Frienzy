import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { Image } from 'react-native-compressor';

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
  console.log('itinerary items for group', itineraryItems);
  return itineraryItems;
};

export const addPhotoToItinerary = async (userId, group, pic) => {
  try {
    const filename = pic?.substring(pic?.lastIndexOf('/') + 1);
    const reference = storage().ref(`SharedPhotos/${group.id}/${filename}`);
    const result = await Image.compress(pic, {
      compressionMethod: 'auto',
    });
    console.log('-image--compress', pic);
    console.log('addPhotoToItinerary: start putFile');
    await reference.putFile(result);
    console.log('addPhotoToItinerary: end putFile');
    const url = await storage().ref(`SharedPhotos/${group.id}/${filename}`).getDownloadURL();
    console.log('addPhotoToItinerary: getDownloadURL', url);

    if (group.photos) {
      await firestore()
        .collection('groups')
        .doc(group.id)
        .update({
          photos: firestore.FieldValue.arrayUnion({
            owner: userId,
            url: url,
          }),
        });
    } else {
      await firestore()
        .collection('groups')
        .doc(group.id)
        .set(
          {
            photos: [
              {
                owner: userId,
                url: url,
              },
            ],
          },
          {
            merge: true,
          }
        );
    }
  } catch (e) {
    console.error(e);
  }
};
export const DeletePhotoFromItinerary = async (group, pic) => {
  const filename = pic?.substring(pic?.lastIndexOf('/') + 1);
  const photoIndex = group.photos.findIndex((photo) => photo.url === pic);
  alert(pic);
  const reference = storage().ref(`SharedPhotos/${group.id}/${filename}`);

  if (photoIndex !== -1) {
    const updatedPhotos = [...group.photos];
    updatedPhotos.splice(photoIndex, 1);
    await firestore().collection('groups').doc(group.id).update({
      photos: updatedPhotos,
    });
  }
  await reference.delete();
};
