import React from 'react';
import { View, Text, StyleSheet, Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-elements';
import navigation from '../../navigation/MainTabStacks/itineraryStack';

const Itinerary = ({ navigation }) => {
  const itineraryItems = [
    {
      title: 'Visit Museum',
      description: 'Explore the local art and history at the museum',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      date: 'May 20, 2023',
    },
    {
      title: 'Hiking Adventure',
      description: 'Enjoy a scenic hike in the mountains',
      startTime: '2:00 PM',
      endTime: '5:00 PM',
      date: 'May 21, 2023',
    },
    // Add more itinerary items as needed
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Itinerary</Text>
        <TouchableOpacity onPress={() => {navigation.navigate('CreateItineraryItem')}}>
        <Ionicons name="add-circle" size={24} color="#000" style={styles.headerIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        {itineraryItems.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
             <Divider />
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description.substring(0, 50)}...</Text>
            <Text style={styles.itemTime}>{item.startTime} - {item.endTime}</Text>
            <Text style={styles.itemDate}>{item.date}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 25,
    flex: 1,
  },
  headerIcon: {
    marginLeft: 10,
  },
  list: {
    marginTop: 10,
  },
  itemContainer: {
    backgroundColor: '#f0f0f0',
    padding: 3,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  itemTime: {
    fontSize: 12,
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
  },
});

export default Itinerary;