import React from "react";

import {createStackNavigator} from "@react-navigation/stack";
import LoginScreen from "../../screens/login/LoginScreen";
import {ScreenNames} from "../../utils/AppConstants";
import OnboardingScreen from "../../screens/onboarding/OnboardingScreen";
import {useSelector} from "react-redux";
import UserLogin from "../../screens/login/UserLogin";
import NotificationsScreen from "../../screens/notifications/NotifcationsScreen";
import VerifyPhone from "../../screens/login/VerifyPhone";
import SplashScreen from "../../screens/splash/SplashScreen";
import UserProfile from "../../screens/profile/UserProfile";

const AuthStack = createStackNavigator();

const AuthStackNavigator = () => {
  const {isFirstLaunch} = useSelector((state) => state.auth);

  return (
    <AuthStack.Navigator
      initialRouteName={
        // isFirstLaunch
          // ? ScreenNames.AuthStack.ONBOARDING
          // ScreenNames.AuthStack.SIGN_IN
          "SplashScreen"
      }
      screenOptions={{
        headerShown: false,
      }}>
        <AuthStack.Screen
        name={'SplashScreen'}
        component={SplashScreen}
      />
        <AuthStack.Screen
          name="UserLogin"
          component={UserLogin}
        />
      <AuthStack.Screen
        name={'VerifyPhone'}
        component={VerifyPhone}
      />
      <AuthStack.Screen
          name="UserProfile"
          component={UserProfile}
        />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
