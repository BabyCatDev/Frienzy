import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// importing screens >>>>
import ContactList from "../../screens/contactList";
import GroupsPage from "../../screens/groups/GroupsPage";

const GroupsStack = createNativeStackNavigator();

const GroupsStackComponent = ({ navigation }) => (
  <GroupsStack.Navigator initialRouteName="Groups">
    <GroupsStack.Screen options={{ headerShown: false }} name="Groups" component={GroupsPage} />
    <GroupsStack.Screen options={{ headerShown: false }} name="Contacts" component={ContactList} />
  </GroupsStack.Navigator>
);

export default GroupsStackComponent;


