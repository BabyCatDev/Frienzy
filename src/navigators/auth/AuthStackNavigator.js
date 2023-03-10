import React from "react";

import {createStackNavigator} from "@react-navigation/stack";
import LoginScreen from "../../screens/login/LoginScreen";
import {ScreenNames} from "../../utils/AppConstants";
import OnboardingScreen from "../../screens/onboarding/OnboardingScreen";
import {useSelector} from "react-redux";

const AuthStack = createStackNavigator();

const AuthStackNavigator = () => {
  const {isFirstLaunch} = useSelector((state) => state.auth);

  return (
    <AuthStack.Navigator
      initialRouteName={
        isFirstLaunch
          ? ScreenNames.AuthStack.ONBOARDING
          : ScreenNames.AuthStack.SIGN_IN
      }
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen
        name={ScreenNames.AuthStack.SIGN_IN}
        component={LoginScreen}
      />
      <AuthStack.Screen
        name={ScreenNames.AuthStack.ONBOARDING}
        component={OnboardingScreen}
      />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
