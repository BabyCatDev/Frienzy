import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// importing screens >>>>
import Map from "../../screens/mapbox/Map";
import ContactList from "../../screens/contactList";

const HomeStack = createNativeStackNavigator();

const HomeStackComponent = ({ navigation }) => (
  <HomeStack.Navigator>
    <HomeStack.Screen options={{ headerShown: false }} name={"Map"} component={Map} />
    <HomeStack.Screen options={{ headerShown: false }} name={"Contacts"} component={ContactList} />
  </HomeStack.Navigator>
);

export default HomeStackComponent;

