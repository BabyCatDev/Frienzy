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
import { createStackNavigator } from '@react-navigation/stack';
import GetLocation, { LocationError } from 'react-native-get-location';
import OverlayScreen from './OverlayScreen';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { saveUserLocation } from '../../services/location/geolocation';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { getItineraryItemsForGroup } from '../../services/firebase/itineraryService';
import ItineraryMarker from './ItineraryMarker';
import { getGroupById } from '../../services/firebase/conversations';
import { set } from 'lodash';

//this is my personal access token, you can use your own, I think it's tied to my secret token which is hardcoded to my environment
Mapbox.setAccessToken(
  'pk.eyJ1Ijoibm9sYW5kb25sZXkxNCIsImEiOiJjazJta2dqNmowaXR2M25uM3RyNzl4bmU1In0.IG-7dVSFafe9cSEpQJoU2A'
);
// Mapbox?.setConnected(true);

export const ItineraryMap = ({ itineraryItems }) => {
  const camera = useRef(null);
  const { height } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [userToPush, setUserToPush] = useState('');
  const [viewMode, setViewMode] = useState('map');
  const [selectedItem, setSelectedItem] = useState('');
  const [isCameraAdjusted, setIsCameraAdjusted] = useState(false);

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
    if (isInitialMount && mapBounds) {
      camera.current.fitBounds(mapBounds.sw, mapBounds.ne, 100, 100);
      setIsInitialMount(false);
    }
  }, [mapBounds, isInitialMount]);

  useEffect(() => {
    // getContacts();
    // getAlarm();
    requestLocation();
  }, []);

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
        saveUserLocation(newLocation, new Date().toISOString());
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
    <View style={styles.page}>
      {/* <View
        style={{
          position: 'absolute',
          zIndex: 10000,
          top: 50,
          left: 0,
          width: '100%',
          flexDirection: 'row',
          margin: 5,
          paddingHorizontal: 10,
          justifyContent: 'center',
        }}
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
      </View> */}
      <View style={{ height: '100%', width: '100%' }}>
        <Mapbox.MapView style={styles.map} styleURL={'mapbox://styles/mapbox/light-v11'}>
          <Mapbox.Camera
            ref={camera}
            followZoomLevel={5}
            zoomLevel={1}
            centerCoordinate={location}
            animationDuration={1000}
          />
          <Mapbox.UserLocation showsUserHeadingIndicator={true} />
          {itineraryItems.length > 0 &&
            itineraryItems.map((item, index) => (
              <Mapbox.MarkerView
                key={index.toString()}
                id={index.toString()}
                coordinate={[item.location.longitude, item.location.latitude]}
              >
                <ItineraryMarker number={index + 1} />
              </Mapbox.MarkerView>
            ))}
        </Mapbox.MapView>
      </View>
      {visible && <OverlayScreen setVisible={setVisible} userToPush={userToPush} />}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  container: {
    height: 300,
    width: 300,
  },
  map: {
    flex: 1,
    width: '100%',
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
