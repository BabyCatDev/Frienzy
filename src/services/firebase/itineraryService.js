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