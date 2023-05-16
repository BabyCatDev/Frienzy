import React, { useState, useEffect } from 'react';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackComponent from './homeStack';
import GroupsStackComponent from './groupsStack';
import ProfileStackComponent from './profileStack';
import { StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import CustomTabBar from './customTabBar';
import { useDispatch } from 'react-redux';
import { setLocationEnabled } from '../../redux/actions/data/UserLocation';
import { useSelector } from 'react-redux';
import { saveUserLocation } from '../../services/location/geolocation';

const MainApp = createBottomTabNavigator();

export const MainAppTabs = () => {
  const enabled = useSelector((state) => state.FrienzyData.isEnabled);
  const bigState = useSelector((state) => state.FrienzyData);
  console.log(bigState)
  //const [enabled, setEnabled] = useState(false);
  const [location, setLocation] = useState('');

  const dispatch = useDispatch();

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
    <MainApp.Navigator tabBar={(props) => <CustomTabBar {...props} />} initialRouteName="Home">
      <MainApp.Screen
        options={({ navigation, route }) => ({
          tabBarLabel: 'Groups',
          headerShown: false,
          tabBarIcon: (focused) => {
            return (
              <Ionicon name={focused ? 'people' : 'people-outline'} style={localStyles.iconStyle} />
            );
          },
        })}
        name={'Groups'}
        component={GroupsStackComponent}
      />
      <MainApp.Screen
        options={({ navigation, route }) => ({
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: (focused) => {
            return (
              <Ionicon
                name={focused ? 'location' : 'location-outline'}
                style={localStyles.iconStyle}
              />
            );
          },
        })}
        name={'Home'}
        component={HomeStackComponent}
      />
      <MainApp.Screen
        options={({ navigation, route }) => ({
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: (focused) => {
            return (
              <Ionicon
                name={focused ? 'person-circle' : 'person-circle-outline'}
                style={localStyles.iconStyle}
              />
            );
          },
        })}
        name={'Profile'}
        component={ProfileStackComponent}
      />
    </MainApp.Navigator>
  );
};

const localStyles = StyleSheet.create({
  iconStyle: {
    color: 'white',
    fontSize: 25,
  },
});
