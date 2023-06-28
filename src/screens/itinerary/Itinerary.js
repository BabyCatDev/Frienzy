import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-elements';
import normalize from 'react-native-normalize';
import { createItineraryItem, getItineraryItemsForGroup } from '../../services/firebase/itineraryService';
import { Colors } from '../../utils/Colors';
import { create } from 'lodash';
import { AppStyles } from '../../utils/AppStyles';

export const Itinerary = ({ navigation, route }) => {
  const { currentGroup } = route.params;
  const [itineraryItems, setItineraryItems] = useState([]);

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
      <ScrollView style={styles.list}>
        {itineraryItems.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={{...AppStyles.semibold20}}>{item.title}</Text>
            <Divider style={styles.itemDivider} />
            <Text style={{...AppStyles.medium13}}>{item.description.substring(0, 50)}...</Text>
            <Text style={{...AppStyles.medium13}}>
              {item.startTime} - {item.endTime}
            </Text>
            <Text style={{...AppStyles.medium13}}>{item.date}</Text>
            <Text style={styles.itemLocation}>{item.location.name}</Text>
            <Text style={styles.itemAddress}>{item.location.address}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateItineraryItem', { onItemCreate: onItemCreate, currentGroup: currentGroup })}>
      <Ionicon name="add-circle" size={64} color="#FB5F2D" />
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingTop: 0,
    backgroundColor: Colors.backgroundGradient[0], // Light blue background color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    // marginTop: 50,
    borderRadius: 8,
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
    marginBottom: 5,
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
    fontWeight: 'bold',
    color: '#000', // Black item location color
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1, // Ensure the button is above the ScrollView
  },
  itemAddress: {
    fontSize: 12,
    color: '#666', // Medium gray item address color
  },
});

