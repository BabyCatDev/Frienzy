import React from "react";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import AuthStackNavigator from "./auth/AuthStackNavigator";
import MainNavigator from "./main/MainStackNavigator";
import { navigationRef, routeNameRef } from "./Refs";
import SplashScreen from "../screens/splash/SplashScreen";



export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

const RootNavigator = () => {
  const { token, autoLoginLoading } = useSelector((state) => state.auth);

  const appState = () => {
    if (token != "") {
      return <MainNavigator />;
    } else if (!autoLoginLoading) {
      return <AuthStackNavigator />;
    }

    return <SplashScreen />;
  };

  return (
    <NavigationContainer
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute();
      }}
      onStateChange={(_) => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute()?.name
        console.log(currentRouteName, 'currentRouteName')
        console.log(previousRouteName, 'previousRouteName')
        routeNameRef.current = currentRouteName;
      }}
      ref={navigationRef}
    >
      {appState()}
    </NavigationContainer>
  );
};

export default RootNavigator;
