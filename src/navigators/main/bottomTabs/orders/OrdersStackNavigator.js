import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  HeaderRight,
  HeaderStyle,
  Header,
  HeaderTitle,
  HeaderLeft,
  HeaderStoreButton,
  EmptyHeaderTitle,
} from "../../../../components/lav.header";
import { Colors, Sizes, ScreenNames } from "../../../../utils/AppConstants";
import { Platform } from "react-native";


const Stack = createStackNavigator();

const OrdersStackNavigator = () => {
  return (
    <Stack.Navigator
      // initialRouteName={ScreenNames.OrdersStack.ORDERS}
      screenOptions={{
        headerLeft: HeaderStoreButton,
        headerRight: HeaderRight,
        headerTitle: EmptyHeaderTitle,
        headerStyle: HeaderStyle,
        headerBackground: Header,
        headerTitleAlign: Platform.isPad ? "center" : "left",
        tabBarShowLabel: false,
        tabBarItemStyle: {
          height: 44,
        },

        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.grayscale[100],
          height: Sizes.tabs.height,
          backgroundColor: Colors.grayscale[0],
        },
      }}
    >
      <Stack.Screen
        name={ScreenNames.OrdersStack.ORDERS}
        component={()=><></>}
      />
    </Stack.Navigator>
  );
};

export default OrdersStackNavigator;
