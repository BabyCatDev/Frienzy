import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet, Text, Platform, TextInput, View } from "react-native";

import { Colors, Sizes } from "../utils/AppConstants";
import { AssetImage } from "../assets/asset_image";

export const LavTextInput = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = "none",
  onSubmitEditing,
  editable = true,
  title,
  titleStyle,
  style,
  leftIcon,
  iconColor,
  placeholderTextColor = Colors.grayscale[300],
  pointerEvents,
  maxLength,
}) => {
  const [isFocus, setIsFocus] = React.useState(false);

  return (
    <View pointerEvents={pointerEvents} style={{ ...styles.wrapper, ...style }}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      {leftIcon && (
        <View style={styles.leftIcon}>
          <AssetImage
            asset={leftIcon}
            width={24}
            height={24}
            stroke={iconColor}
          />
        </View>
      )}

      <TextInput
        onChangeText={onChangeText}
        defaultValue={value}
        style={{
          ...styles.input,
          borderColor: isFocus ? Colors.primary[900] : Colors.grayscale[100],
          paddingLeft: leftIcon ? 46 : 16,
        }}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={placeholderTextColor}
        onFocus={(e) => setIsFocus(true)}
        onBlur={(e) => setIsFocus(false)}
        keyboardType={keyboardType}
        editable={editable}
        onSubmitEditing={onSubmitEditing}
        maxLength={maxLength}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.grayscale[100],
    paddingTop: Sizes.medium,
    paddingHorizontal: Platform.isPad ? 64 : Sizes.medium,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: Platform.isPad ? 343 : WINDOW_WIDTH - 32,
    height: Platform.isPad ? 343 : WINDOW_WIDTH - 32,
    borderWidth: 1,
    borderRadius: Sizes.medium,
    borderColor: Colors.grayscale[200],
    marginBottom: 22,
  },
  image: {
    width: Platform.isPad ? 343 : WINDOW_WIDTH - 32,
    height: Platform.isPad ? 343 : WINDOW_WIDTH - 32,
    borderRadius: Sizes.medium,
  },
  subHeaderText: {
    fontFamily: Platform.select({
      ios: "Roboto",
      android: "Roboto-Medium",
    }),
    fontWeight: Platform.select({ ios: "600" }),
    fontSize: 18,
    lineHeight: Sizes.large,
    color: Colors.grayscale[900],
  },
  characteristics: {
    width: "100%",
    marginBottom: Sizes.medium * 2,
  },
  input: {
    borderWidth: 1,
    paddingRight: 11,
    fontSize: 16,
    fontFamily: Platform.select({
      ios: "Roboto",
      android: "Roboto-Regular",
    }),
    fontWeight: Platform.select({ ios: "400" }),
    color: Colors.grayscale[900],

    paddingHorizontal: Sizes.medium,
    borderColor: Colors.grayscale[100],
    backgroundColor: Colors.grayscale[0],
    borderRadius: 12,
    height: 44,
  },
  title: {
    fontFamily: Platform.select({
      ios: "Roboto",
      android: "Roboto-Regular",
    }),
    fontWeight: Platform.select({ ios: "400" }),
    fontSize: 16,
    color: Colors.grayscale[400],
    marginTop: 16,
    marginBottom: 4,
  },
  wrapper: {
    position: "relative",
  },
  leftIcon: {
    position: "absolute",
    bottom: 10,
    left: 15,
    zIndex: 100,
  },
});
