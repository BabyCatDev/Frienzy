import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { Divider } from 'react-native-elements';
import normalize from 'react-native-normalize';
import SearchField from '../../components/utils/SearchField';
import { createStackNavigator } from '@react-navigation/stack';
import { ItineraryMap } from '../map/ItineraryMap';

import {
  createItineraryItem,
  getItineraryItemsForGroup,
} from '../../services/firebase/itineraryService';
import { Colors } from '../../utils/Colors';
import { create } from 'lodash';
import { AppStyles } from '../../utils/AppStyles';

export const Itinerary = ({ navigation, route }) => {
  const Stack = createStackNavigator();
  const [query, setQuery] = useState('');
  const { currentGroup } = route.params;
  const [itineraryItems, setItineraryItems] = useState([]);
  const [searchedItems, setSearchedItems] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const handleToggle = (mode) => {
    setViewMode(mode);
  };

  useEffect(() => {
    async function getItineraryItems() {
      const tempDetails = await getItineraryItemsForGroup(currentGroup);
      const sortedItems = tempDetails.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.startTime);
        const dateB = new Date(b.date + ' ' + b.startTime);

        return dateA - dateB;
      });
      setItineraryItems(sortedItems);
    }
    getItineraryItems();
  }, [currentGroup]);

  const openMaps = (address) => {
    const mapUrl = Platform.select({
      ios: `http://maps.apple.com/?address=${address}`,
      android: `http://maps.google.com/?q=${address}`,
    });

    Linking.openURL(mapUrl);
  };
  const searchItineraryItems = (criteria) => {
    // Assuming you have stored the itinerary items in an array called 'itineraryItems'
    // Perform the search based on the provided criteria
    const searchResults = itineraryItems.filter((item) => {
      // Customize the conditions as per your desired search criteria
      return (
        item.title.toLowerCase().includes(criteria.toLowerCase()) ||
        item.description.toLowerCase().includes(criteria.toLowerCase()) ||
        item.location.name.toLowerCase().includes(criteria.toLowerCase())
      );
    });

    return searchResults;
  };
  const onItemCreate = (itineraryItem) => {
    // Add navigation logic for creating a new itinerary item
    // add itinerary item to itineraryItems array
    //make a post to the firebase

    console.log('onItemCreate', currentGroup, itineraryItem);
    createItineraryItem(currentGroup, itineraryItem);
    const tempDetails = [...itineraryItems, itineraryItem];
    const sortedItems = tempDetails.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.startTime);
      const dateB = new Date(b.date + ' ' + b.startTime);

      return dateA - dateB;
    });
    setItineraryItems(sortedItems);

    console.log('create item', itineraryItem, currentGroup);
  };
  useEffect(() => {
    let resultItems = searchItineraryItems(query);
    setSearchedItems(resultItems);
  }, [query, itineraryItems]);

  return (
    <View style={styles.container}>
      <SearchField
        search={query}
        setSearch={setQuery}
        containerStyle={[
          { width: '100%', color: Colors.gray },
          viewMode === 'map' ? { display: 'none' } : null,
        ]}
      />
      <View
        style={[
          {
            position: 'absolute',
            zIndex: 1,
            top: 10,
            left: 0,
            width: '100%',
            flexDirection: 'row',
            margin: 5,
            paddingHorizontal: 10,
            paddingVertical: 10,
            justifyContent: 'center',
          },
          viewMode === 'list' ? { position: 'relative' } : null,
        ]}
      >
        <View style={styles.toggleWrapper}>
          <TouchableOpacity
            onPress={() => handleToggle('list')}
            style={[
              styles.toggleButton,
              {
                backgroundColor: viewMode === 'list' ? '#FB5F2D' : 'transparent',
              },
            ]}
          >
            <Text style={{ color: viewMode === 'list' ? 'white' : 'black', fontWeight: 'bold' }}>
              List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleToggle('map')}
            style={[
              styles.toggleButton,
              {
                backgroundColor: viewMode === 'map' ? '#FB5F2D' : 'transparent',
              },
            ]}
          >
            <Text style={{ color: viewMode === 'map' ? 'white' : 'black', fontWeight: 'bold' }}>
              Map
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {viewMode === 'list' ? (
        <ScrollView style={styles.list}>
          {searchedItems.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={{ ...AppStyles.semibold20 }}>{item.title}</Text>
              <Divider style={styles.itemDivider} />
              <Text style={{ ...AppStyles.medium13 }}>{item.description.substring(0, 50)}...</Text>
              <Text style={{ ...AppStyles.medium13 }}>
                {item.startTime} - {item.endTime}
              </Text>
              <Text style={{ ...AppStyles.medium13 }}>{item.date}</Text>
              <TouchableOpacity onPress={() => openMaps(item.location.name)}>
                <Text style={styles.itemLocation}>{item.location.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ItineraryMap itineraryItems={itineraryItems} />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate('CreateItineraryItem', {
            onItemCreate: onItemCreate,
            currentGroup: currentGroup,
          })
        }
      >
        <Text style={{ fontSize: 30, color: 'white' }}>+</Text>
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
    textDecorationLine: 'underline',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#FB5F2D',
    borderRadius: 50,
    paddingTop: 3,
    paddingBottom: 17,
    paddingRight: 15,
    paddingLeft: 17,
    borderWidth: 5,
    borderColor: 'white',
    boxShadow: '3px 3px 5px #000000',
    elevation: 5,
  },
  itemAddress: {
    fontSize: 12,
    color: '#666', // Medium gray item address color
  },
  toggleWrapper: {
    backgroundColor: '#EBEBEB',
    flexDirection: 'row',
    borderRadius: 43,
  },
  toggleButton: {
    borderRadius: 43,
    padding: 5,
    width: 50,
    alignItems: 'center',
  },
});
