import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking } from 'react-native';
var Url = require('url-parse');
// importing screens >>>>
import ContactList from '../../screens/contactList';
import GroupThread from '../../screens/groups/GroupThread';
import { FrienzyList } from '../../screens/frienzyList/FrienzyListScreen';
import { Itinerary } from '../../screens/itinerary/Itinerary';
import { NewFrienzyCreation } from '../../screens/frienzyList/CreateFrienzyScreen';
import { InviteFriends } from '../../screens/frienzyList/InviteFriendsScreen';
import userProfile from '../../screens/profile/UserProfile';
import { useConversations } from '../../hooks/useConversations';
import { ActiveFrienzy } from '../../screens/frienzyList/ActiveFrienzyScreen';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserLocation } from '../../services/location/geolocation';
import { MyFriends } from '../../screens/profile/MyFriends';
import { AddFriend } from '../../screens/group_friends/AddFriend';
import CreateItineraryItem from '../../screens/itinerary/createItineraryItem';
import { setLocationEnabled } from '../../redux/actions/data/UserLocation';
import { addUserToGroup } from '../../services/firebase/conversations';

const GroupsStack = createNativeStackNavigator();

const useInitialURL = () => {
  const [url, setUrl] = useState(null);
  const [processing, setProcessing] = useState(true);
  useEffect(() => {
    let subscription = null;
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();

      // The setTimeout is just for testing purpose
      setTimeout(() => {
        setUrl(initialUrl);
        setProcessing(false);
      }, 1000);
    };

    getUrlAsync();
    subscription = Linking.addEventListener('url', ({ url }) => {
      setUrl(url);
    });
    return () => {
      subscription && Linking.removeEventListener?.(subscription);
    };
  }, []);

  return { url, processing };
};

const GroupsStackComponent = ({ navigation }) => {
  useConversations();
  const enabled = useSelector((state) => state.FrienzyData.isEnabled);
  const bigState = useSelector((state) => state.FrienzyData);
  const { url, processing } = useInitialURL();
  console.log(bigState);
  //const [enabled, setEnabled] = useState(false);
  const [location, setLocation] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    var urlParams = new Url(url, true);
    var query = urlParams.query;
    const groupId = urlParams.hash.slice(1);
    addUserToGroup(groupId);
    // navigation.navigate('ActiveFrienzy', { groupInfo: groupId });

    // console.log('deeplink', urlParams.hash.slice(1), query);
  }, [url]);
  useEffect(() => {
    //   /// 1.  Subscribe to events.
    const onLocation = BackgroundGeolocation.onLocation((event) => {
      console.log('[onLocation]', event.coords);
      const location = event.coords;
      const time = event.timestamp;
      saveUserLocation(location, time);
    });

    const onHeartbeat = BackgroundGeolocation.onHeartbeat((event) => {
      console.log('[onHeartbeat]', event);
      const location = event.location.coords;
      const time = event.location.timestamp;
      saveUserLocation(location, time);
    });

    const onMotionChange = BackgroundGeolocation.onMotionChange((event) => {
      // const location = event.coords;
      // const time = event.timestamp;
      // saveUserLocation(location, time);
      console.log('[onMotionChange]', event);
    });

    const onActivityChange = BackgroundGeolocation.onActivityChange((event) => {
      console.log('[onActivityChange]', event);
      // const location = event.coords;
      // const time = event.timestamp;
      // saveUserLocation(event.location, event.time);
    });

    const onProviderChange = BackgroundGeolocation.onProviderChange((event) => {
      console.log('[onProviderChange]', event);
    });

    /// 2. ready the plugin.
    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      heartbeatInterval: 60,
      preventSuspend: true,
      stopTimeout: 5,
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,
      startOnBoot: true,
      batchSync: false,
      autoSync: true,
    }).then((state) => {
      //setEnabled(state.enabled);
      dispatch(setLocationEnabled(state.enabled));
      console.log('- BackgroundGeolocation is configured and ready: ', state.enabled);
    });

    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload.  Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
      onHeartbeat.remove();
    };
  }, []);

  useEffect(() => {
    console.log('Enabled', enabled);
    if (enabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
      setLocation('');
    }
  }, [enabled]);

  return (
    <GroupsStack.Navigator>
      <GroupsStack.Screen
        options={{ headerShown: false }}
        name="FrienzyList"
        component={FrienzyList}
      />
      <GroupsStack.Screen
        options={{ headerShown: false }}
        name="NewFrienzyCreation"
        component={NewFrienzyCreation}
      />
      <GroupsStack.Screen
        options={{ headerShown: false }}
        name="InviteFriendsScreen"
        component={InviteFriends}
      />
      <GroupsStack.Screen
        options={{ headerShown: false }}
        name="ActiveFrienzy"
        component={ActiveFrienzy}
      />
      <GroupsStack.Screen options={{ headerShown: false }} name="Itinerary" component={Itinerary} />
      <GroupsStack.Screen
        options={{ headerShown: false }}
        name="CreateItineraryItem"
        component={CreateItineraryItem}
      />

      <GroupsStack.Screen
        options={{ headerShown: false }}
        name="UserProfile"
        component={userProfile}
      />
      <GroupsStack.Screen
        options={{ headerShown: false }}
        name="GroupThread"
        component={GroupThread}
      />
      <GroupsStack.Screen options={{ headerShown: false }} name="AddFriend" component={AddFriend} />
      <GroupsStack.Screen options={{ headerShown: false }} name="MyFriends" component={MyFriends} />
      <GroupsStack.Screen options={{ headerShown: false }} name="Friends" component={ContactList} />
    </GroupsStack.Navigator>
  );
};

export default GroupsStackComponent;
