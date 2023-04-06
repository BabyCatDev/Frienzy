// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Map from "../../screens/mapbox/Map";
import { useSelector } from "react-redux";
import ProfileStackNavigator from "../profile/ProfileStackNavigator";
import ContactsStackNavigator from "../contacts/ContactsStackNavigator";

const Stack = createStackNavigator();

const MainNavigator = ({navigation}) => {
  const { isFirstLaunch } = useSelector((state) => state.auth);

  return (
    <Stack.Navigator
      initialRouteName={isFirstLaunch ? "ProfileStack" : "Map"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={"Map"} component={Map} />
      <Stack.Screen name={"ProfileStack"} component={ProfileStackNavigator} />
      <Stack.Screen name={"ContactsStack"} component={ContactsStackNavigator} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
