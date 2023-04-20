import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserProfile from "../../screens/profile/UserProfile";
const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen name="UserProfile" component={UserProfile} />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackNavigator;
