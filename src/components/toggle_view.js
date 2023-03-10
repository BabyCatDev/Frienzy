import React, { useCallback, useMemo, useState } from "react";
import { View, StyleSheet, Text, Vibration } from "react-native";
import { Colors, Sizes } from "../utils/AppConstants";
import { MemoToggle, Toggle } from "./toggle";

export const ToggleView = ({
  up,
  middle,
  single,
  title,
  titleStyle,
  bold,
  style,
  value = false,
  dependenciesList = [],
  onValueChange = () => {},
}) => {
  const toggleSwitch = useCallback(() => {
    onValueChange(!value);
  }, [value, ...dependenciesList]);

  const extraStyles = {
    borderTopLeftRadius: up || single ? Sizes.medium : 0,
    borderTopRightRadius: up || single ? Sizes.medium : 0,
    borderBottomLeftRadius: up || middle ? 0 : Sizes.medium,
    borderBottomRightRadius: up || middle ? 0 : Sizes.medium,
    borderWidth: 0.5,
    borderColor: Colors.grayscale[100],
  };

  return (
    <View
      style={[
        styles.container,
        extraStyles,
        bold && { backgroundColor: "transparent", paddingHorizontal: 0 },
        style,
      ]}
    >
      <Text
        style={[
          styles.title,
          bold && {
            color: Colors.grayscale[400],
            fontFamily: Platform.select({
              ios: "Roboto",
              android: "Roboto-Medium",
            }),
            fontWeight: Platform.select({ ios: "600" }),
            fontSize: 16,
          },
          titleStyle,
        ]}
      >
        {title}
      </Text>
      <MemoToggle isOn={value} onToggle={toggleSwitch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.grayscale[0],
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Sizes.medium,
    paddingVertical: 10,
    alignItems: "center",
  },
  title: {
    fontWeight: Platform.select({ ios: "400", android: undefined }),
    fontFamily: Platform.select({ ios: "Roboto", android: "Roboto-Regular" }),
    fontSize: 14,
    lineHeight: 20,
    color: Colors.grayscale[900],
  },
});
