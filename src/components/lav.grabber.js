import React from "react";
import { Platform, View } from "react-native";
import normalize from "react-native-normalize";
import { Colors } from "../utils/AppConstants";

export const LavGrabber = ({ style }) => {
  return (
    <View
      style={[
        {
          backgroundColor: Colors.grayscale[400],
          borderRadius: 4,
          alignSelf: "center",
          width: Platform.isPad ? 32 : normalize(32),
          height: 4,
        },
        style,
      ]}
    />
  );
};
