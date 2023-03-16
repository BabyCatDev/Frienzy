import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../utils/Colors";
import { AppStyles } from "../utils/AppStyles";
import { Text, Pressable } from "react-native";

export const MainButton = ({ onPress, title }) => {
  return (
    <Pressable onPress={onPress}>
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
          <Text
            style={AppStyles.buttonTitle}
          >{title}</Text>
        </LinearGradient>
      </LinearGradient>
    </Pressable>
  );
};
