import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// importing screens >>>>
import UserProfile from "../../screens/profile/UserProfile";
import MyFriends from "../../screens/profile/MyFriends";

const ProfileStack = createNativeStackNavigator();

const ProfileStackComponent = ({ navigation }) => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen options={{ headerShown: false }} name="UserProfile" component={UserProfile} />
    <ProfileStack.Screen options={{ headerShown: false }} name="MyFriends" component={MyFriends} />
  </ProfileStack.Navigator>
);

export default ProfileStackComponent;

