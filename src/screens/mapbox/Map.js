import React, { memo, useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { Header } from '../../components/utils/Header';
import normalize from 'react-native-normalize';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/Colors';
import GetLocation, { LocationError } from 'react-native-get-location';
import OverlayScreen from './OverlayScreen';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { saveUserLocation } from '../../services/location/geolocation';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { getItineraryItemsForGroup } from '../../services/firebase/itineraryService';
import FriendMarker from './FriendMarker';
import { getGroupById } from '../../services/firebase/conversations';
import { set } from 'lodash';


//this is my personal access token, you can use your own, I think it's tied to my secret token which is hardcoded to my environment
Mapbox.setAccessToken(
  'pk.eyJ1Ijoibm9sYW5kb25sZXkxNCIsImEiOiJjazJta2dqNmowaXR2M25uM3RyNzl4bmU1In0.IG-7dVSFafe9cSEpQJoU2A'
);
// Mapbox?.setConnected(true);

export const Map = ({ navigation, params, route }) => {
  const camera = useRef(null);
  const { height } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [userToPush, setUserToPush] = useState('');
  const [usersLocations, setUsersLocations] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(route.params.currentGroup);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [groupDetails, setGroupDetails] = useState({});
  const [isCameraAdjusted, setIsCameraAdjusted] = useState(false);
  const [itineraryItems, setItineraryItems] = useState([]);

  // const { currentGroup } = route.params;
  console.log('groupinfo.id', users);



  const getBoundingBoxCorners = (coordinates) => {
    console.log('Getting bounds for coords', coordinates);
    if (coordinates.length == 0) return { location, location };
    let minLng = coordinates[0][0];
    let minLat = coordinates[0][1];
    let maxLng = coordinates[0][0];
    let maxLat = coordinates[0][1];

    for (const coordinate of coordinates) {
      const [lng, lat] = coordinate;
      minLat = Math.min(minLat, lat);
      minLng = Math.min(minLng, lng);
      maxLat = Math.max(maxLat, lat);
      maxLng = Math.max(maxLng, lng);
    }

    const sw = [minLng, minLat];
    const ne = [maxLng, maxLat];

    return { sw, ne };
  };

  const [mapBounds, setMapBounds] = useState(null);
const [isInitialMount, setIsInitialMount] = useState(true);

useEffect(() => {
  let unsubscribe;

  const getUsersLocations = async () => {
    const querySnapshot = await firestore()
      .collection('users')
      .where('groups', 'array-contains', currentGroup)
      .get();

    const usersLocationsNew = querySnapshot.docs.map((item) => {
      const itemData = item.data();
      const location = itemData.currentLocation;

      if ('latitude' in location && 'longitude' in location) {
        return {
          latitude: location.latitude,
          longitude: location.longitude,
          name: itemData.name,
          profilePic: itemData.profilePic,
          id: itemData.uid,
          time: location.time,
        };
      } else if ('coords' in location && 'latitude' in location.coords && 'longitude' in location.coords) {
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          name: itemData.name,
          profilePic: itemData.profilePic,
          id: itemData.uid,
          time: location.time,
        };
      } else {
        return null;
      }
    });

    const filteredLocations = usersLocationsNew.filter((location) => location !== null);

    // Update the users or usersLocations state here
    // setUsersLocations(filteredLocations.filter((uLN) => uLN.id !== auth().currentUser.uid));
    setUsers(filteredLocations.filter((uLN) => uLN.id !== auth().currentUser.uid));

    if (currentGroup && usersLocationsNew.length > 0) {
      const bounds = getBoundingBoxCorners(usersLocationsNew.map((loc) => [loc.longitude, loc.latitude]));

      // Only update the mapBounds if it's not already set
      if (!mapBounds) {
        setMapBounds(bounds);
      }
    }
  };

  if (currentGroup) {
    unsubscribe = firestore()
      .collection('users')
      .where('groups', 'array-contains', currentGroup)
      .onSnapshot(() => {
        getUsersLocations();
      });
  }

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
}, [currentGroup]);

useEffect(() => {
  if (isInitialMount && mapBounds) {
    camera.current.fitBounds(mapBounds.sw, mapBounds.ne, 100, 100);
    setIsInitialMount(false);
  }
}, [mapBounds, isInitialMount]);


  useEffect(() => {
    async function getGroupDetails() {
      const details = await getGroupById(currentGroup);
      setGroupDetails(details);
    }
    async function getItineraryItems() {
      const tempDetails = await getItineraryItemsForGroup(currentGroup);
      setItineraryItems(tempDetails);
      console.log('temp Details', tempDetails)
    }
    getItineraryItems();
    getGroupDetails();
  }, [currentGroup]);

  useEffect(() => {
    // getContacts();
    // getAlarm();
    requestLocation();
  }, []);


  const handleGroupSelection = (group) => {
    setCurrentGroup(group);
    setSelectedGroup(group);
    setIsCameraAdjusted(false);
  };

  const handleMarkerPress = (item) => {
    setSelectedItem(item);
  };

  const requestLocation = () => {
    setLoading(true);
    setLocation([1, 1]);
    setError(null);

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
      rationale: {
        title: 'Location permission',
        message: 'The app needs the permission to request your location.',
        buttonPositive: 'Ok',
      },
    })
      .then((newLocation) => {
        setLoading(false);
        saveUserLocation(newLocation);
        setLocation([newLocation.longitude, newLocation.latitude]);
      })
      .catch((ex) => {
        if (ex instanceof LocationError) {
          const { code, message } = ex;
          console.warn(code, message);
          setError(code);
        } else {
          console.warn(ex);
        }
        setLocation((prev) => prev);
        setLoading(false);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <View style={{ height: height * 0.88, width: '100%', zIndex: 1 }}>
        <Mapbox.MapView
          style={{ width: '100%', height: '100%' }}
          styleURL={'mapbox://styles/mapbox/light-v11'}
        >
          <Mapbox.Camera
            ref={camera}
            followZoomLevel={5}
            zoomLevel={17}
            centerCoordinate={location}
            animationDuration={1000}
          />

          {users.length > 0
            ? users.map((user, index) => (
              <Mapbox.MarkerView
                coordinate={[user.longitude, user.latitude]}
                key={index}
                id={index}
              >
                {/* <View style={{justifyContent: 'center', alignItems: 'center'}}> */}
                <FriendMarker
                  contact={user}
                  setUserToPush={setUserToPush}
                  setVisible={setVisible}
                />
                {/* <Text>{user.date}</Text> */}
                {/* </View> */}
              </Mapbox.MarkerView>
            ))
            : null}
          <Mapbox.UserLocation showsUserHeadingIndicator={true} />
          {itineraryItems.length > 0 &&
              itineraryItems.map((item, index) => (
                <Mapbox.MarkerView key={index.toString()} id={index.toString()} coordinate={[item.location.longitude, item.location.latitude]}>
                  <View style={{ backgroundColor: Colors.darkGray, borderRadius: 10, padding: 5 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.title}</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Start Time: {item.startTime}</Text>
                  </View>
                </Mapbox.MarkerView>
              ))}
        </Mapbox.MapView>
      </View>
      {/* <TouchableOpacity
        onPress={() => setAlarm(true)}
        disabled={alarmDisabled}
        style={{
          position: 'absolute',
          right: 10,
          bottom: 80,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      > */}
      {/* <AssetImage
          asset={alarmDisabled ? Assets.emrgDisabled : Assets.emrgButton}
          width={normalize(90)}
          height={normalize(91)}
        />
        {Platform.OS === 'android' && (
          <AssetImage
            asset={Assets.whiteBell}
            stroke={'black'}
            containerStyle={{ position: 'absolute' }}
            width={normalize(32)}
            height={normalize(32)}
          />
        )}
      </TouchableOpacity> */}
      {visible && <OverlayScreen setVisible={setVisible} userToPush={userToPush} />}
      {/* {alarm && (
        <AlarmOverlay
          setVisible={setAlarm}
          usersToPush={users}
          setAlarmDisabled={setAlarmDisabled}
        />
      )} */}
    </View>
  );
};

