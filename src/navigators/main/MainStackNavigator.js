// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { BottomTabNavigator } from "./bottomTabs/BottomTabNavigator";
import { ScreenNames } from "../../utils/AppConstants";

import NotificationsScreen from "../../screens/notifications/NotifcationsScreen";
import PinScreen from "../../screens/pin/PinScreen";
import UserLogin from "../../screens/login/UserLogin";
import SplashScreen from "../../screens/splash/SplashScreen";

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={"SplashScreen"}
        component={SplashScreen}
      />
      <Stack.Screen
        name={"NotificationsScreen"}
        component={NotificationsScreen}
      />
      <Stack.Screen
        name={ScreenNames.MainStack.BOTTOM_TABS}
        component={BottomTabNavigator}
      />
      <Stack.Screen
        name={ScreenNames.MainStack.NOTIFICATIONS}
        component={NotificationsScreen}
      />
      <Stack.Screen
        name={ScreenNames.MainStack.PIN_CODE}
        component={PinScreen}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
