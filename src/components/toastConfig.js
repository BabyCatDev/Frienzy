import React from "react";
import { Platform, View, Text } from "react-native";
import Assets from "../assets";
import { AssetImage } from "../assets/asset_image";
import { Colors } from "../utils/AppConstants";

export const ToastConfig = {
  success: ({ props }) => (
    <View
      style={{
        height: 40,
        width: "100%",
        backgroundColor: Colors.additional.green[100],
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <AssetImage
        asset={Assets.check}
        width={24}
        stroke={Colors.grayscale[0]}
      />
      <Text
        style={{
          marginLeft: 8,
          fontSize: 14,
          color: Colors.grayscale[0],
          fontWeight: Platform.select({ ios: "500" }),
          fontFamily: Platform.select({
            ios: "Roboto",
            android: "Roboto-Medium",
          }),
        }}
      >
        {props.title}
      </Text>
    </View>
  ),
  warning: ({ props }) => (
    <View
      style={{
        height: 40,
        width: "100%",
        backgroundColor: Colors.additional.orange[100],
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <AssetImage
        asset={Assets.alertTriangle}
        width={24}
        stroke={Colors.grayscale[0]}
      />
      <Text
        style={{
          marginLeft: 8,
          fontSize: 14,
          color: Colors.grayscale[0],
          fontWeight: Platform.select({ ios: "500" }),
          fontFamily: Platform.select({
            ios: "Roboto",
            android: "Roboto-Medium",
          }),
        }}
      >
        {props.title}
      </Text>
    </View>
  ),
  denied: ({ props }) => (
    <View
      style={{
        height: 40,
        width: "100%",
        backgroundColor: Colors.additional.red[100],
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <AssetImage
        asset={Assets.camera}
        width={24}
        stroke={Colors.grayscale[0]}
      />
      <Text
        style={{
          marginLeft: 8,
          fontSize: 14,
          color: Colors.grayscale[0],
          fontWeight: Platform.select({ ios: "500" }),
          fontFamily: Platform.select({
            ios: "Roboto",
            android: "Roboto-Medium",
          }),
        }}
      >
        {props.title}
      </Text>
    </View>
  ),
};
