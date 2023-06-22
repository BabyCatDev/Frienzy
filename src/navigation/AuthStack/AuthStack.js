import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import UserLogin from "../../screens/login/UserLogin";

const AuthStack = createNativeStackNavigator();

export const GetAuthComponents = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen options={{ headerShown: false }} name="UserLogin" component={UserLogin} />
  </AuthStack.Navigator>
);
