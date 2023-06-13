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
import { Header } from '../../components/Header';
import { AssetImage } from '../../assets/asset_image';
import Assets from '../../assets';
import normalize from 'react-native-normalize';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/Colors';
import GetLocation, { LocationError } from 'react-native-get-location';
import edcOverlayData from '../../assets/EDC.json'
import OverlayScreen from './OverlayScreen';
import AlarmOverlay from './AlarmOverlay';
import CacheImage from '../../utils/CacheImage';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { saveUserLocation } from '../../services/location/geolocation';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { getItineraryItemsForGroup } from '../../services/firebase/itineraryService';
import { useSelector } from 'react-redux'
import FriendMarker from './FriendMarker';
import { getGroupById } from '../../services/firebase/conversations';
import { set } from 'lodash';


//this is my personal access token, you can use your own, I think it's tied to my secret token which is hardcoded to my environment
Mapbox.setAccessToken(
  'pk.eyJ1Ijoibm9sYW5kb25sZXkxNCIsImEiOiJjazJta2dqNmowaXR2M25uM3RyNzl4bmU1In0.IG-7dVSFafe9cSEpQJoU2A'
);
// Mapbox?.setConnected(true);

const Map = ({ navigation, route }) => {
  const camera = useRef(null);
  const { height } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [userToPush, setUserToPush] = useState('');
  const [usersLocations, setUsersLocations] = useState([]);
  const [currentGroup, setCurrentGroup] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [groupDetails, setGroupDetails] = useState({});
  const [isCameraAdjusted, setIsCameraAdjusted] = useState(false);
  const [itineraryItems, setItineraryItems] = useState([]);

  console.log('users', users);

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

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .where('groups', 'array-contains', currentGroup)
      .onSnapshot((docSnap) => {
        console.log('usersLocationsNew', docSnap.docs)
        const usersLocationsNew = docSnap.docs.map((item) => {
          const itemData = item.data();
          const location = itemData.currentLocation;
          // console.log('location', location)
          if ('latitude' in location && 'longitude' in location) {
            return {
              latitude: location.latitude,
              longitude: location.longitude,
              name: itemData.name,
              profilePic: itemData.profilePic,
              id: itemData.uid,
              time: location.time,
            };
          } else if (
            'coords' in location &&
            'latitude' in location.coords &&
            'longitude' in location.coords
          ) {
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
        const bounds = getBoundingBoxCorners(
          usersLocationsNew.map((loc) => [loc.longitude, loc.latitude])
        );
        // after this, markers are no longer added to the center of the map

        // setUsersLocations(filteredLocations.filter((uLN) => uLN.id !== auth().currentUser.uid));
        setUsers(filteredLocations.filter((uLN) => uLN.id !== auth().currentUser.uid));


        if (currentGroup && usersLocationsNew.length > 0) {
          camera.current.fitBounds(bounds.sw, bounds.ne, 100, 100);
        }
      });
    return () => unsubscribe();
  }, [currentGroup]);


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
      <LinearGradient
        style={{
          height: height * 0.12,
          width: '100%',
          paddingTop: height * 0.055,
          paddingHorizontal: 20,
          overflow: 'visible',
          zIndex: 2,
        }}
        colors={Colors.backgroundGradient}
      >
        <Header
          onPressLeft={requestLocation}
          leftIcon={() => <Ionicon name={'locate-outline'} size={normalize(25)} color={'white'} />}
          rightIcon={currentGroup ? () => <Ionicon name={'calendar-outline'} size={normalize(25)} color={'white'} /> : null}
          onPressRight={() => navigation.navigate('Itinerary', { currentGroup: currentGroup })}
          title={
            <View
              style={{
                flex: 1,
                marginLeft: 200,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  marginBottom: 15,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: normalize(28),
                }}
              >
                Frienzy
              </Text>
              {/* <AssetImage
                asset={Assets.logo}
                width={normalize(40)}
                height={normalize(30)}
                style={{ marginLeft: 15 }}
              /> */}
            </View>
          }
          navigation={navigation}
          headerButton
          headerValue={currentGroup}
          setHeaderValue={(value) => handleGroupSelection(value)}
          noBackButton
          containerStyle={{
            overflow: 'visible',
            alignItems: 'center',
          }}
        />
      </LinearGradient>
      <View style={{ height: height * 0.88, width: '100%', zIndex: 1 }}>
        <Mapbox.MapView
          style={{ width: '100%', height: '100%' }}
          styleURL={'mapbox://styles/mapbox/dark-v11'}
        >
          <Mapbox.Camera
            ref={camera}
            followZoomLevel={5}
            zoomLevel={17}
            centerCoordinate={location}
            animationDuration={1000}
          />
          <Mapbox.ShapeSource id="coachellaOverlay" shape={edcOverlayData}>
            <Mapbox.FillLayer
              id="coachellaOverlayFill"
              style={{ fillColor: '#ff6600', fillOpacity: 0.5 }}
            />
            <Mapbox.LineLayer
              id="coachellaOverlayLine"
              style={{ lineColor: '#ff6600', lineWidth: 2 }}
            />
            <Mapbox.SymbolLayer
              id="coachellaOverlaySymbol"
              style={{
                textField: ['get', 'stageName'],
                textSize: 8,
                textOffset: [0, 1],
                textJustify: 'center',
                textAnchor: 'center',
                textFont: ['Open Sans Bold'],
                textPadding: 5,
                textAllowOverlap: true,
                textIgnorePlacement: true,
              }}
            />
          </Mapbox.ShapeSource>

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
          {itineraryItems.length > 0 ? (
            itineraryItems.map((item, index) => (
              <Mapbox.MarkerView
                id={index.toString()}
                key={index.toString()}
                coordinate={[item.location.longitude, item.location.latitude]}
                onPress={() => setSelectedItem(item)}
              >
                <View style={{ backgroundColor: 'blue', borderRadius: 10, padding: 5 }}>
                  <Text style={{ color: 'white' }}>{item.title}</Text>
                </View>
              </Mapbox.MarkerView>
            ))
          ) : null}

          {selectedItem && (
            <Mapbox.Callout style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: 'white' }}>
              <Text>{selectedItem.description}</Text>
            </Mapbox.Callout>
          )}
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

export default Map;
