// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
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

const ProductsSctackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ScreenNames.ProductsStack.ADD_TO_SHOWCASE}
      screenOptions={{
        headerLeft: HeaderStoreButton,
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
        name={ScreenNames.ProductsStack.PRODUCTS}
        component={()=><></>}
      />
    </Stack.Navigator>
  );
};

export default ProductsSctackNavigator;
