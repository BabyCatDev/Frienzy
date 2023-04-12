// @flow
import React, { useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import ProductsStackNavigator from "./products/ProductsStackNavigator";
import {
  TabActionButton,
  TabButton,
} from "../../../components/lav.bottom_bar_buttons";
import { Colors, Sizes, TabNames } from "../../../utils/AppConstants";
import { Strings } from "../../../utils/Localizations";
import { EmptyScreen } from "../../../utils/EmptyScreen";
import Localization from "../../../services/LocalizationService";

import {
  HeaderRight,
  HeaderStyle,
  Header,
  EmptyHeaderTitle,
  HeaderStoreButton,
} from "../../../components/lav.header";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { navigationRef } from "../../Refs";
import { ScreenNames } from "../../../utils/AppConstants";
import OrdersStackNavigator from "./orders/OrdersStackNavigator";
import SuppliesStackNav from "./stock/SuppliesStackNav";
import ProfileStackNav from "./profile/ProfileStackNav";

const Tab = createBottomTabNavigator();

const ExceptionScreens = [ScreenNames.OrdersStack.PRODUCT_COMPOSITION];

const setTabBarVisible = () => {
  var currentScreenName = navigationRef?.getCurrentRoute()?.name ?? "";
  return ExceptionScreens.includes(currentScreenName) === false;
};

const setBottomInset = () => {
  if (!setTabBarVisible()) return -Sizes.tabs.height;
  return 0;
};

export function BottomTabNavigator({ navigation }) {
  const bottomSheetModalRef = useRef(null);

  return (
    <BottomSheetModalProvider>
      <Tab.Navigator
        initialRouteName={TabNames.ORDERS}
        screenOptions={() => ({
          headerLeft: HeaderStoreButton,
          headerRight: HeaderRight,
          headerTitle: EmptyHeaderTitle,
          headerStyle: HeaderStyle,
          headerBackground: Header,
          tabBarShowLabel: false,
          tabBarItemStyle: {
            height: 44,
          },

          // tabBarHideOnKeyboard: true,
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: Colors.grayscale[100],
            height: Sizes.tabs.height,
            backgroundColor: Colors.grayscale[0],
          },
        })}
      >
        <Tab.Screen
          name={TabNames.ORDERS}
          component={OrdersStackNavigator}
          options={{
            headerShown: false,
            tabBarVisible: setTabBarVisible(),
            tabBarItemStyle: {
              marginLeft: Platform.isPad ? "5%" : 0,
              height: 44,
            },
            tabBarIcon: ({ focused }) => (
              <TabButton
                type={TabNames.ORDERS}
                name={Localization.getString("common", "orders")}
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name={TabNames.PRODUCTS}
          component={ProductsStackNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabButton
                type={TabNames.PRODUCTS}
                name={Localization.getString("common", "products")}
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name={TabNames.STOCK}
          component={SuppliesStackNav}
          options={{
            headerTitleAlign: Platform.isPad ? "center" : "left",
            headerTitle: Localization.getString("common", "stock"),
            headerShown: false,
            headerTitleStyle: {
              fontWeight: Platform.select({ ios: "500" }),
              fontFamily: Platform.select({
                ios: "Roboto",
                android: "Roboto-Medium",
              }),
            },
            tabBarIcon: ({ focused }) => (
              <TabButton
                type={TabNames.STOCK}
                name={Localization.getString("common", "stock")}
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name={TabNames.PROFILE}
          component={ProfileStackNav}
          options={{
            tabBarItemStyle: {
              marginRight: Platform.isPad ? "5%" : 0,
              height: 44,
            },
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabButton
                type={TabNames.PROFILE}
                name={Localization.getString("common", "profile")}
                focused={focused}
              />
            ),
          }}
        />
      </Tab.Navigator>

      
    </BottomSheetModalProvider>
  );
}
