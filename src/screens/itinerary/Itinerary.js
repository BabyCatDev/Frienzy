import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-elements';
import { Header } from '../../components/Header';
import normalize from 'react-native-normalize';
import { createItineraryItem } from '../../services/firebase/itineraryService';
import { getGroupById } from '../../services/firebase/conversations';

const Itinerary = ({ navigation }) => {
  const [currentGroup, setCurrentGroup] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groupDetails, setGroupDetails] = useState({}); // { name: '', id: '' }
  const [headerValue, setHeaderValue] = useState('');
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
    console.log(currentGroup)
    async function getGroupDetails() {
      const details = await getGroupById(currentGroup);
      console.log('details', details)
      setGroupDetails(details);
    }
    getGroupDetails();
  }, [currentGroup]);

  const handleGroupSelection = (group) => {
    setCurrentGroup(group);
    setSelectedGroup(group);
  };

  const onItemCreate = (newItem) => {
    // Update the itineraryItems state with the new item
    createItineraryItem(currentGroup.id, newItem);
    setItineraryItems((prevItems) => [...prevItems, newItem]);

  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header
          leftIcon={() => <Ionicon name={'locate-outline'} size={normalize(30)} color={'white'} />}
          title={
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Frienzy</Text>
            </View>
          }
          navigation={navigation}
          headerButton
          headerValue={currentGroup}
          setHeaderValue={(value) => handleGroupSelection(value)}
          rightIcon={currentGroup ? () => <Ionicon name={'add'} size={normalize(30)} color={'white'} /> : null}
          onPressRight={() => navigation.navigate('CreateItineraryItem', { onItemCreate, currentGroup })}
          noBackButton
          containerStyle={styles.headerContainer}
        />
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
    backgroundColor: 'black',
    zIndex: 1,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    marginBottom: 15,
    color: 'white',
    fontWeight: 'bold',
    fontSize: normalize(28),
  },
  headerContainer: {
    overflow: 'visible',
    alignItems: 'center',
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