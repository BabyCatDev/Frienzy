import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import UserProfile from "../../screens/profile/UserProfile";
const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {
  const { isFirstLaunch } = useSelector((state) => state.auth);

  return (
    <ProfileStack.Navigator
      // initialRouteName={
      // isFirstLaunch
      // ? ScreenNames.AuthStack.ONBOARDING
      // ScreenNames.AuthStack.SIGN_IN
      // "SplashScreen"
      // }
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen name="UserProfile" component={UserProfile} />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackNavigator;
