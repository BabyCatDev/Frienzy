import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// importing screens >>>>
import ContactList from "../../screens/contactList";
import GroupsPage from "../../screens/groups/GroupsPage";
import GroupThread from "../../screens/groups/GroupThread";

const GroupsStack = createNativeStackNavigator();

const GroupsStackComponent = ({ navigation }) => (
  <GroupsStack.Navigator initialRouteName="GroupsList">
    <GroupsStack.Screen options={{ headerShown: false }} name="GroupsList" component={GroupsPage} />
    <GroupsStack.Screen options={{ headerShown: false }} name="GroupThread" component={GroupThread}/>
    <GroupsStack.Screen options={{ headerShown: false }} name="Contacts" component={ContactList} />
  </GroupsStack.Navigator>
);

export default GroupsStackComponent;


