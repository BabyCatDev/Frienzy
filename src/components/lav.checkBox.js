import React from "react";
import { Text, View, StyleSheet } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function LavCheckBox({
  label,
  style,
  isChecked,
  onPress,
  iconStyle,
  innerIconStyle,
  fillColor,
  labelStyle,
}) {
  return (
    <View style={{ ...styles.container, ...style }}>
      <Text style={{ ...styles.text, labelStyle }}>{label}</Text>

      <BouncyCheckbox
        size={25}
        fillColor={fillColor}
        disableText
        iconStyle={iconStyle}
        innerIconStyle={innerIconStyle}
        isChecked={isChecked}
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 16,
    color: "#1D3145",
  },
});
