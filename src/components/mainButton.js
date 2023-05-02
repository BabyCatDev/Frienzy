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

export const MainButton = ({ onPress, title, containerStyle, isLoading, isDisabled=false }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ ...containerStyle }} disabled={isDisabled}>
      <LinearGradient
        useAngle={true}
        angle={90.72}
        colors={isDisabled ? [Colors.gray, Colors.gray] : Colors.borderGradient}
        style={AppStyles.buttonOutline}
      >
        <LinearGradient
          useAngle={true}
          angle={90.72}
          colors={isDisabled ? [Colors.gray, Colors.gray] : Colors.mainGradient}
          style={AppStyles.buttonContainer}
        >
          {!isLoading ? (
            <Text style={[AppStyles.buttonTitle, { color: isDisabled ? "gray" : "white"}]}>{title}</Text>
          ) : (
            <ActivityIndicator color={"#1A1822"}/>
          )}
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
};
