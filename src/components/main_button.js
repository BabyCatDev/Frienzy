import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../utils/Colors";
import { AppStyles } from "../utils/AppStyles";
import {
  Text,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

export const MainButton = ({ onPress, title, containerStyle, isLoading }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ ...containerStyle }}>
      <LinearGradient
        useAngle={true}
        angle={90.72}
        colors={Colors.borderGradient}
        style={AppStyles.buttonOutline}
      >
        <LinearGradient
          useAngle={true}
          angle={90.72}
          colors={Colors.mainGradient}
          style={AppStyles.buttonContainer}
        >
          {!isLoading ? (
            <Text style={AppStyles.buttonTitle}>{title}</Text>
          ) : (
            <ActivityIndicator color={"#1A1822"}/>
          )}
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
};
