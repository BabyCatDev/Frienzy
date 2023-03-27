// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserProfile from "../../screens/profile/UserProfile";
import Map from "../../screens/mapbox/Map";
import ContactList from "../../screens/contact-list/ContactList";

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={"Map"}
        component={Map}
      />
      <Stack.Screen
        name={"UserProfile"}
        component={UserProfile}
      />
      <Stack.Screen
        name={"Contacts"}
        component={ContactList}
      />
      {/* <Stack.Screen
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
      /> */}
    </Stack.Navigator>
  );
};

export default MainNavigator;
