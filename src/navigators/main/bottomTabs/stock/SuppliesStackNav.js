import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
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
// import ViewSuppliesScreen from "../../../../screens/stock/viewSupplies/ViewSuppliesScreen";
import Localization from "../../../../services/LocalizationService";

const Stack = createStackNavigator();

const SuppliesStackNav = () => {
  return (
    <Stack.Navigator
      initialRouteName={ScreenNames.StockTopTabs.STOCK}
      screenOptions={{
        headerLeft: HeaderStoreButton,
        headerRight: HeaderRight,
        headerStyle: HeaderStyle,
        headerBackground: Header,
        headerTitleAlign: Platform.isPad ? "center" : "left",
        tabBarShowLabel: false,
        title: Localization.getString("common", "stock"),
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
        name={ScreenNames.StockTopTabs.STOCK}
        component={()=><></>}
      />
    </Stack.Navigator>
  );
};

export default SuppliesStackNav;
