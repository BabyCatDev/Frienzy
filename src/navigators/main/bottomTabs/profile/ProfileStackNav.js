// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { ScreenNames } from "../../../../utils/AppConstants";
import { Platform } from "react-native";
import { logout } from "../../../../store/slices/AuthSlice";
import { useDispatch } from "react-redux";
import {
  Header,
  HeaderSignOutButton,
  HeaderStoreButton,
  HeaderStyle,
  HeaderTitle,
} from "../../../../components/lav.header";

const Stack = createStackNavigator();

const ProfileStackNav = () => {
  const dispatch = useDispatch();
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: HeaderStoreButton,
        headerStyle: HeaderStyle,
        headerBackground: Header,
        headerTitle: HeaderTitle,
        headerRight: () => <HeaderSignOutButton onPress={() => dispatch(logout())}/>,
        headerTitleContainerStyle: {
          marginHorizontal: 8,
        },
        headerTitleAlign: Platform.isPad ? "center" : "left",
      }}
    >
      <Stack.Screen
        name={ScreenNames.ProfileStack.PROFILE}
        component={()=><></>}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNav;
