import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-elements';
import { Header } from '../../components/Header';
import normalize from 'react-native-normalize';

const Itinerary = ({ navigation }) => {
  const [currentGroup, setCurrentGroup] = useState('');
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

  const onItemCreate = (newItem) => {
    // Update the itineraryItems state with the new item
    setItineraryItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header
          onPressRight={() => navigation.navigate('CreateItineraryItem', { onItemCreate })}
          rightIcon={() => (
            <Ionicon color={'black'} name={'duplicate-outline'} size={normalize(23)} />
          )}
          title={'Itinerary'}
          navigation={navigation}
          noBackButton
          containerStyle={{ marginBottom: 15 }}
        />
      </View>
      <ScrollView style={styles.list}>
        {itineraryItems.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Divider />
            <Text style={styles.itemDescription}>{item.description.substring(0, 50)}...</Text>
            <Text style={styles.itemTime}>
              {item.startTime} - {item.endTime}
            </Text>
            <Text style={styles.itemDate}>{item.date}</Text>
            <Text style={styles.itemLocation}>{item.location.name}</Text>
            <Text style={styles.itemAddress}>{item.location.address}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff', // Light blue background color
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 25,
    flex: 1,
    color: '#000', // Black header text color
  },
  headerIcon: {
    marginLeft: 10,
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