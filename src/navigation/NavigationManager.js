import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import SplashScreen from '../screens/splash/SplashScreen';
import { useDispatch, useSelector } from 'react-redux';
import { userAuthStateListener } from '../redux/actions/data/UserDetails';
import { NavigationContainer } from '@react-navigation/native';
import { GetAuthComponents } from './AuthStack';
import { GetMainAppComponents } from './MainStack';
import { GetOnboardingComponents } from './OnboardingStack';

const linking = {
  prefixes: ['frienzy://'],
  config: {
    screens: {
      Frienzy: {
        screens: {
          Groups: {
            screens: {
              GroupsList: 'groups/:threadId',
              GroupThread: 'groups/thread/:threadId',
            },
          },
        },
      },
    },
  },
};

const NavigationManager = (props) => {
  const currentUserObj = useSelector((state) => state.FrienzyAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userAuthStateListener());
  }, []);

  if (!currentUserObj.loaded) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {currentUserObj.userDetails == null || currentUserObj.userDetails?.loggedIn == false ? (
          <GetAuthComponents />
        ) : !currentUserObj.userDetails.profileCompleted ? (
          <GetOnboardingComponents />
        ) : (
          <GetMainAppComponents />
        )}
      </View>
    </NavigationContainer>
  );
};

export default NavigationManager;
