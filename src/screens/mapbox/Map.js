import React, { memo, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
  TouchableOpacity,
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
import { getObject } from '../../utils/AsyncStore';
import FGLocationRetriever from '../../services/FGLocationRetriever';
import { useFocusEffect } from '@react-navigation/native';
import coachellaOverlayData from '../../assets/coachella.json';
import { getMobileNumber } from '../../utils/helper';
import OverlayScreen from './OverlayScreen';
import AlarmOverlay from './AlarmOverlay';
import CacheImage from '../../utils/CacheImage';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useLocationForGroup } from '../../hooks/useLocation';
import { saveUserLocation } from '../../services/location/geolocation';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useSelector } from 'react-redux';
import FriendMarker from './FriendMarker';
import { getGroupById } from '../../services/firebase/conversations';
import { useQuery } from 'react-query';

//this is my personal access token, you can use your own, I think it's tied to my secret token which is hardcoded to my environment
Mapbox.setAccessToken(
  'pk.eyJ1Ijoibm9sYW5kb25sZXkxNCIsImEiOiJjazJta2dqNmowaXR2M25uM3RyNzl4bmU1In0.IG-7dVSFafe9cSEpQJoU2A'
);
// Mapbox?.setConnected(true);

const Map = ({ navigation, route }) => {
  const { height } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState([]);
  const [error, setError] = useState(null);
  const [alarmDisabled, setAlarmDisabled] = useState(false);
  const [counter, setCounter] = useState();
  const [contacts, setContacts] = useState([]);
  const [alarm, setAlarm] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState({});
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const renderUsers = filterUsers(users);
  const [userToPush, setUserToPush] = useState('');
  //const usersLocations = useSelector((state) => state.FrienzyData.groupLocations);
  const [usersLocations, setUsersLocations] = useState([]);
  const [currentGroup, setCurrentGroup] = useState('AcQSnKXxDMQDjSgsJ85u');
  const [groupDetails, setGroupDetails] = useState({});

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .where('groups', 'array-contains', currentGroup)
      .onSnapshot((docSnap) => {
        const usersLocationsNew = docSnap.docs
          .filter((item) => item.id != auth().currentUser.uid)
          .map((item) => {
            const itemData = item.data();
            return {
              ...itemData.currentLocation,
              name: itemData.name,
              profilePic: itemData.profilePic,
            };
          });
        //console.log('\nHERE in docsnap\n', usersLocationsNew);
        setUsersLocations(usersLocationsNew);
        //dispatch(setGroupLocations(usersLocations));
      });

    return unsubscribe;
  }, [currentGroup]);

  useEffect(() => {
    async function getGroupDetails() {
      const details = await getGroupById(currentGroup);
      setGroupDetails(details);
    }
    getGroupDetails();
  }, [currentGroup]);

  async function getContacts() {
    const selectedContactList = await getObject('selectedContactList');
    const contacts = await getObject('contacts');
    setSelectedContacts(selectedContactList);
    setContacts(contacts);
  }
  async function getAlarm() {
    const alarm = await getObject('alarm');
    setAlarmDisabled(alarm);
  }

  //useLocationForGroup(currentGroup);

  useEffect(() => {
    getContacts();
    getAlarm();
    requestLocation();
  }, []);

  useEffect(() => {
    //console.log('Locations', usersLocations, usersLocations.length);
  }, [usersLocations]);

  const getInitials = (name) => {
    const fullName = name;
    return fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('');
  };

  const onStagePress = (stage) => {
    setSelectedStage(stage.id);
  };

  const renderStages = () => {
    return stages.map((stage) => {
      const isSelected = selectedStage === stage.id;
      const fillColor = isSelected ? '#00FF00' : '#0000FF';

      return (
        <Mapbox.ShapeSource
          key={stage.id}
          id={stage.id}
          shape={{
            type: 'Point',
            coordinates: stage.coordinates,
          }}
        >
          <Mapbox.CircleLayer
            id={`${stage.id}-circle`}
            style={{
              circleColor: fillColor,
              circleRadius: 10,
            }}
          />
          <Mapbox.SymbolLayer
            id={`${stage.id}-label`}
            style={{
              textField: stage.stageName,
              textSize: 12,
              textOffset: [0, 1],
              textAnchor: 'top',
            }}
          />
        </Mapbox.ShapeSource>
      );
    });
  };

  const onUsersLocationUpdate = (locations) => {
    const users = locations.map((location) => {
      return {
        phone: location.phone,
        coordinates: [location.long, location.lat],
        date: location.date,
        alarm: location.alarm,
        profile_pic: location.profile_pic,
        key: location.key,
      };
    });

    setUsers(users);
  };

  function filterUsers(users) {
    const renderUsers = [];
    for (elem in contacts) {
      const phone = getMobileNumber(contacts[elem]);
      const user = users.find((user) => user.phone == phone);
      if (user !== undefined) {
        renderUsers.push({
          alarm: user.alarm,
          phone: user.phone,
          coordinates: user.coordinates,
          givenName: contacts[elem].givenName,
          familyName: contacts[elem].familyName,
          profile_pic: user.profile_pic,
          key: user.key,
          date: user.date,
        });
      }
    }
    return renderUsers;
  }

  // useFocusEffect(
  //   React.useCallback(() => {
  //     FGLocationRetriever.getInstance().setOnPhonesLocationsListener(onUsersLocationUpdate);

  //     FGLocationRetriever.getInstance().startListeningToLocationUpdates();

  //     async function getCounter() {
  //       const counter = await getObject('counter');
  //       setCounter(counter == null ? 0 : counter);
  //     }
  //     getCounter();

  //     // returned function will be called on component unmount
  //     return () => {
  //       FGLocationRetriever.getInstance().stopListeningToLocationUpdates();
  //     };
  //   }, [])
  // );

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
          leftIcon={() => <Ionicon name={'locate-outline'} size={normalize(23)} color={'white'} />}
          title={'Coachella'}
          navigation={navigation}
          headerButton
          headerValue={currentGroup}
          setHeaderValue={(value) => setCurrentGroup(value)}
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
            followZoomLevel={5}
            zoomLevel={17}
            centerCoordinate={location}
            animationDuration={1000}
          />
          <Mapbox.ShapeSource id="coachellaOverlay" shape={coachellaOverlayData}>
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

          {usersLocations.length > 0
            ? usersLocations.map((user, index) => (
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
        </Mapbox.MapView>
      </View>
      <TouchableOpacity
        onPress={() => setAlarm(true)}
        disabled={alarmDisabled}
        style={{
          position: 'absolute',
          right: 10,
          bottom: 80,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AssetImage
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
      </TouchableOpacity>
      {visible && <OverlayScreen setVisible={setVisible} userToPush={userToPush} />}
      {alarm && (
        <AlarmOverlay
          setVisible={setAlarm}
          usersToPush={users}
          setAlarmDisabled={setAlarmDisabled}
        />
      )}
    </View>
  );
};

export default Map;
