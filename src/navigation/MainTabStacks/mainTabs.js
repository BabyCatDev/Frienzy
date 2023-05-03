import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackComponent from "./homeStack";
import GroupsStackComponent from "./groupsStack";
import ProfileStackComponent from "./profileStack";
import { StyleSheet } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import CustomTabBar from "./customTabBar";

const MainApp = createBottomTabNavigator();


export const MainAppTabs = () => (
    <MainApp.Navigator tabBar={props => <CustomTabBar {...props} />} initialRouteName="Home">
      <MainApp.Screen
        options={({ navigation, route }) => ({
          tabBarLabel: "Groups",
          headerShown: false,
          tabBarIcon: (focused) => {
            return (
                <Ionicon
                  name={focused ? "people" : "people-outline"}
                  style={localStyles.iconStyle}
                />
            );
          },
        })}
        name={"Groups"}
        component={GroupsStackComponent}
      />
      <MainApp.Screen
        options={({ navigation, route }) => ({
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: (focused) => {
            return (
                <Ionicon
                  name={focused ? "location" : "location-outline"}
                  style={localStyles.iconStyle}
                />
            );
          },
        })}
        name={"Home"}
        component={HomeStackComponent}
      />
      <MainApp.Screen
        options={({ navigation, route }) => ({
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: (focused) => {
            return (
                <Ionicon
                  name={focused ? "person-circle" : "person-circle-outline"}
                  style={localStyles.iconStyle}
                />
            );
          },
        })}
        name={"Profile"}
        component={ProfileStackComponent}
      />
    </MainApp.Navigator>
);

const localStyles = StyleSheet.create({
  iconStyle: {
    color: "white", 
    fontSize: 25
  }
})