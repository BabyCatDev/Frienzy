import React from 'react';
import { MainAppTabs } from './MainTabStacks/mainTabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
        component={MainAppTabs}
        options={{
          headerShown: false,
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};
