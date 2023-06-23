import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsStackComponent from '../MainTabStacks/frienzyStack';

const Stack = createNativeStackNavigator();

export const GetMainAppComponents = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={'Frienzy'}
        component={GroupsStackComponent}
        options={{
          headerShown: false,
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};
