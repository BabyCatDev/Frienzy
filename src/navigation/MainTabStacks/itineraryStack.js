import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// importing screens >>>>
import Itinerary from "../../screens/itinerary/Itinerary";
import CreateItineraryItem from "../../screens/itinerary/createItineraryItem";

const ItineraryStack = createNativeStackNavigator();

const ItineraryStackComponent = ({ navigation }) => (
  <ItineraryStack.Navigator>
    <ItineraryStack.Screen options={{ headerShown: false }} name={"Itinerary"} component={Itinerary} />
    <ItineraryStack.Screen options={{ headerShown: false }} name={"CreateItineraryItem"} component={CreateItineraryItem} />
  </ItineraryStack.Navigator>
);

export default ItineraryStackComponent;


