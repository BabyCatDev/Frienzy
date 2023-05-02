import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PhotoUpload from "../screens/onboarding/photoUpload";

// importing screens >>>>


const OnboardingStack = createNativeStackNavigator();

export const GetOnboardingComponents = () => (
  <OnboardingStack.Navigator>
    <OnboardingStack.Screen
      options={{ headerShown: false }}
      name={"PhotoUpload"}
      component={PhotoUpload}
    />
  </OnboardingStack.Navigator>
);
