import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  Modal,
} from 'react-native';
import { Button, Divider } from 'react-native-elements';
import normalize from 'react-native-normalize';
import SearchField from '../../components/utils/SearchField';
import { createStackNavigator } from '@react-navigation/stack';
import { ItineraryMap } from '../map/ItineraryMap';
import Timeline from 'react-native-timeline-flatlist';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { getUserById } from '../../services/firebase/user';
import {
  createItineraryItem,
  getItineraryItemsForGroup,
} from '../../services/firebase/itineraryService';
import { Colors } from '../../utils/Colors';
import { AppStyles } from '../../utils/AppStyles';
import moment from 'moment-timezone';

export const Itinerary = ({ navigation, route }) => {
  const Stack = createStackNavigator();
  const [query, setQuery] = useState('');
  const { currentGroup } = route.params;
  const [itineraryItems, setItineraryItems] = useState([]);
  const [searchedItems, setSearchedItems] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);

  const handleToggle = (mode) => {
    setViewMode(mode);
  };
  const convertToSortableFormat = (date, time, timezone) => {
    const dateTime = `${date} ${time}`;
    return moment.tz(dateTime, 'ddd MMM DD YYYY hh:mm A', timezone);
  };

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
      const aTime = convertToSortableFormat(a.date, a.startTime, a.timezone);
      const bTime = convertToSortableFormat(b.date, b.startTime, b.timezone);

      return aTime.diff(bTime);
    });
    setItineraryItems(sortedItems);

    console.log('create item', itineraryItem, currentGroup);
  };
  const renderCustomTooltipContent = () => {
    return (
      <View style={styles.tooltipContent}>
        <Text style={styles.tooltipText}>This is a custom tooltip content!</Text>
      </View>
    );
  };
  const renderDetail = (rowData) => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ width: '90%', display: 'flex', flexDirection: 'column' }}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ maxwidth: '70%' }}>
              <Text style={{ ...AppStyles.semibold20 }}>{rowData.title}</Text>
            </View>
            <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
              <Text style={[{ ...AppStyles.medium13 }, { textAlign: 'right' }]}>
                {rowData?.creator}
              </Text>
            </View>
          </View>
          <Text style={{ ...AppStyles.medium13 }}>{rowData.description}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setModalData(rowData);
            setModalVisible();
          }}
        >
          <Ionicon
            name={'menu-outline'}
            size={normalize(24)}
            style={{ marginLeft: 9 }}
            color={'black'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCircle = ({ time, isLast }) => {
    // Custom styling for the last circle
    const circleStyle = isLast ? styles.lastCircle : styles.circle;

    return (
      <View style={circleStyle}>
        <Text style={{ color: '#FFF', textAlign: 'center' }}>{time}</Text>
      </View>
    );
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
  useEffect(() => {
    console.log(searchedItems);
    let resultItems = searchItineraryItems(query);
    const promises = resultItems.map((item) => getUserById(item.createdBy));
    Promise.all(promises).then((users) => {
      let edtieditems = resultItems.map((item, i) => ({
        ...item,
        time: i + 1,
        creator: users[i]?.name,
      }));
      setSearchedItems(edtieditems);
    });
  }, [query, itineraryItems]);

  return (
    <View style={styles.container}>
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
      <SearchField
        search={query}
        setSearch={setQuery}
        containerStyle={[
          { width: '100%', color: Colors.gray },
          viewMode === 'map' ? { display: 'none' } : null,
        ]}
      />
      {viewMode === 'list' ? (
        <Timeline
          data={searchedItems}
          lineColor="#101010"
          showTime={false}
          renderCircle={renderCircle}
          renderDetail={renderDetail}
        />
      ) : (
        <ItineraryMap
          itineraryItems={itineraryItems}
          setModalData={setModalData}
          setModalVisible={setModalVisible}
          currentGroup={currentGroup}
        />
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
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
      >
        {/*All views of Modal*/}
        {/*Animation can be slide, slide, none*/}
        <View style={styles.modal_container}>
          <Text style={styles.modal_title}>{modalData?.title}</Text>
          <Text style={styles.modal_description}>{modalData?.description}</Text>
          <Text style={styles.modal_description}>{modalData?.location?.name}</Text>
          <View style={styles.modal_timeContainer}>
            <Text style={styles.modal_time}>{`Start Time: ${modalData?.startTime}`}</Text>
            <Text style={styles.modal_time}>{`End Time: ${modalData?.endTime}`}</Text>
          </View>
          <Text style={styles.modal_time}>{`Timezone: ${modalData?.timezone}`}</Text>
          <Text style={styles.modal_date}>{modalData?.date}</Text>
          <TouchableOpacity
            title="Click To Close Modal"
            onPress={() => {
              setModalVisible(!setModalVisible);
            }}
            style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}
          >
            <Text
              style={{
                backgroundColor: '#AFAFAF',
                borderRadius: 10,
                textAlign: 'center',
                width: '30%',
                boxShadow: '3px 3px 5px #000000',
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    width: '90%',
    backgroundColor: '#F6F6F6',
    // White background color for each itinerary item
    padding: 10,
    marginBottom: 5,
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
  circle: {
    position: 'absolute',
    left: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FB5F2D',
    borderWidth: 3,
    borderColor: 'white',
    boxShadow: '3px 3px 5px #000000',
  },
  lastCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'green',
  },
  modal_container: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 200,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modal_title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modal_description: {
    fontSize: 16,
    marginBottom: 8,
  },
  modal_timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modal_time: {
    fontSize: 14,
    color: '#555555',
  },
  modal_date: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'right',
  },
});
