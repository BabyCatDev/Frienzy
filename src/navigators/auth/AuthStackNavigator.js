import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import UserLogin from "../../screens/login/UserLogin";
import VerifyPhone from "../../screens/login/VerifyPhone";

const AuthStack = createStackNavigator();

const AuthStackNavigator = () => {
  const { isFirstLaunch } = useSelector((state) => state.auth);

  return (
    <AuthStack.Navigator
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
      <AuthStack.Screen name="UserLogin" component={UserLogin} />
      <AuthStack.Screen name={"VerifyPhone"} component={VerifyPhone} />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
