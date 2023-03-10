// @flow
import React from "react";
import { Platform, useWindowDimensions } from "react-native";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

import Assets from "../assets";
import { AssetImage } from "../assets/asset_image";
import { Colors, TabNames } from "../utils/AppConstants";
import { PrimaryButton } from "./lav.buttons";

export const TabButton = ({ type, name, focused }) => {
  const selectAsset = () => {
    switch (type) {
      case TabNames.ORDERS:
        return Assets.shoppingCart;
      case TabNames.PRODUCTS:
        return Assets.grid;
      case TabNames.STOCK:
        return Assets.home;
      case TabNames.PROFILE:
        return Assets.user;
      default:
        break;
    }
  };
  const selectColor = () => {
    return focused ? Colors.primary[1000] : Colors.grayscale[500];
  };

  return (
    <View style={styles.tabButton}>
      <AssetImage asset={selectAsset()} height={25} stroke={selectColor()} />
      <Text style={[styles.tabLabel, { color: selectColor() }]}>{name}</Text>
    </View>
  );
};

export const TabActionButton = ({ onPress }) => {
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        width: Platform.isPad ? width * 0.18 : "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 3,
      }}
    >
      <TouchableOpacity style={styles.invisibleArea} />
      <PrimaryButton
        onPress={onPress}
        asset={Assets.plus}
        stroke={Colors.grayscale[0]}
        imageWidth={24}
        imageHeight={24}
        style={{ backgroundColor: Colors.primary[900], width: 44, height: 44 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    // flex: 1,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    paddingTop: 3,
    flexDirection: Platform.isPad ? "row" : "column",
  },
  tabLabel: {
    marginTop: 4,
    fontFamily: "Roboto-Regular",
    width: 70,
    fontSize: Platform.isPad ? 14 : 10,
    textAlign: Platform.isPad ? "left" : "center",
    paddingLeft: Platform.isPad ? 10 : 0,
  },
  primaryRed: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    height: 44,
    width: 44,
    borderRadius: 15,
    backgroundColor: Colors.primary[900],
    elevation: 1,
  },
  invisibleArea: {
    position: "absolute",
    zIndex: 0,
    width: "100%",
    height: "100%",
  },

  text: {
    fontFamily: "Roboto-Regular",
    fontSize: 13,
  },
});
