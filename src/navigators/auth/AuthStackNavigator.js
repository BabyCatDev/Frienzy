import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserLogin from "../../screens/login/UserLogin";
import VerifyPhone from "../../screens/login/VerifyPhone";

const AuthStack = createStackNavigator();

const AuthStackNavigator = () => {

  return (
    <AuthStack.Navigator
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
