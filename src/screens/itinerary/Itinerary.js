import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-elements';
import normalize from 'react-native-normalize';
import { createItineraryItem, getItineraryItemsForGroup } from '../../services/firebase/itineraryService';
import { create } from 'lodash';

const Itinerary = ({ navigation, route }) => {
  const { currentGroup } = route.params;
  const [itineraryItems, setItineraryItems] = useState([
    {
      title: 'Visit Museum',
      description: 'Explore the local art and history at the museum',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      date: 'May 20, 2023',
      location: {
        name: 'Museum of Art',
        address: '123 Main St, Anytown, USA',
        latitude: 37.785834,
        longitude: -122.406417,
      },
    },
    {
      title: 'Hiking Adventure',
      description: 'Enjoy a scenic hike in the mountains',
      startTime: '2:00 PM',
      endTime: '5:00 PM',
      date: 'May 21, 2023',
      location: {
        name: 'Mountain Trail',
        address: '456 Mountain Rd, Anytown, USA',
        latitude: 37.785834,
        longitude: -122.406417,
      },
    },
    // Add more itinerary items as needed
  ]);

  useEffect(() => { 
    async function getItineraryItems() {
      const tempDetails = await getItineraryItemsForGroup(currentGroup);
      setItineraryItems(tempDetails);
    }
    getItineraryItems();
  }, [currentGroup]);

  const onItemCreate = (itineraryItem) => {
    // Add navigation logic for creating a new itinerary item
    // add itinerary item to itineraryItems array
    //make a post to the firebase

    console.log('onItemCreate', currentGroup, itineraryItem)
    createItineraryItem(currentGroup, itineraryItem);

    setItineraryItems([...itineraryItems, itineraryItem]);
    console.log('create item', itineraryItem, currentGroup)
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Itinerary</Text>
        <TouchableOpacity onPress={() =>
    navigation.navigate('CreateItineraryItem', { onItemCreate: onItemCreate, currentGroup: currentGroup })
  }
>
          <Ionicon name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.list}>
        {itineraryItems.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Divider style={styles.itemDivider} />
            <Text style={styles.itemDescription}>{item.description.substring(0, 50)}...</Text>
            <Text style={styles.itemTime}>
              {item.startTime} - {item.endTime}
            </Text>
            <Text style={styles.itemDate}>{item.date}</Text>
            <Text style={styles.itemLocation}>{item.location.name}</Text>
            <Text style={styles.itemAddress}>{item.location.address}</Text>
            <Text style={styles.itemAddress}>{item.location.latitude}</Text>
            <Text style={styles.itemAddress}>{item.location.longitude}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: 'black', // Light blue background color
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    marginTop: 50,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black', 
  },
  list: {
    marginTop: 10,
  },
  itemContainer: {
    backgroundColor: '#fff', // White background color for each itinerary item
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2, // Add a slight elevation for a card-like effect
  },
  itemDivider: {
    marginVertical: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000', // Black item title color
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 5,
    color: '#444', // Dark gray item description color
  },
  itemTime: {
    fontSize: 12,
    marginBottom: 2,
    color: '#666', // Medium gray item time color
  },
  itemDate: {
    fontSize: 12,
    marginBottom: 2,
    color: '#666', // Medium gray item date color
  },
  itemLocation: {
    fontSize: 12,
    marginBottom: 2,
    fontWeight: 'bold',
    color: '#000', // Black item location color
  },
  itemAddress: {
    fontSize: 12,
    color: '#666', // Medium gray item address color
  },
});

export default Itinerary;
