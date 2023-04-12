import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import normalize from "react-native-normalize";
import { AssetImage } from "../assets/asset_image";

import { Colors } from "../utils/AppConstants";

export const PrimaryButton = ({
  label,
  style,
  onPress,
  asset,
  fill,
  stroke,
  enabled = true,
  isLoading = false,
  onEnlargedStyle = false,
  imageWidth,
  imageHeight = 16,
  imageContainerStyle,
  textStyle,
  onShadowStyle,
}) => {
  return (
    <TouchableOpacity
      disabled={!enabled || isLoading}
      onPress={onPress}
      style={[
        buttonStyle.primaryBlue,
        !enabled && !isLoading && buttonStyle.disabledButton,
        style,
        onShadowStyle && buttonStyle.shadow,
      ]}
    >
      {asset && (
        <AssetImage
          asset={asset}
          width={imageWidth ?? imageHeight}
          height={imageHeight}
          fill={fill}
          stroke={stroke}
          containerStyle={[imageContainerStyle]}
        />
      )}
      {!isLoading ? (
        <Text
          style={[
            buttonStyle.primaryBlueText,
            textStyle,
            !onEnlargedStyle && buttonStyle.smallText,
          ]}
        >
          {label}
        </Text>
      ) : (
        <ActivityIndicator color={Colors.grayscale[0]} />
      )}
    </TouchableOpacity>
  );
};

export const TransparentButton = ({
  label,
  style,
  onPress,
  asset,
  fill,
  stroke = Colors.primary[900],
  enabled = true,
  isLoading = false,
  imageWidth,
  imageHeight = 20,
  imageContainerStyle,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      disabled={!enabled}
      onPress={onPress}
      style={[
        buttonStyle.transparentButton,
        !enabled && !isLoading && buttonStyle.disabledButton,
        style,
      ]}
    >
      {asset && (
        <AssetImage
          asset={asset}
          width={imageWidth ?? imageHeight}
          height={imageHeight}
          fill={fill}
          stroke={stroke}
          containerStyle={[
            imageContainerStyle,
            {
              marginRight: 8,
              width: 24,
              height: 24,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        />
      )}
      {!isLoading ? (
        <Text style={[buttonStyle.transparentButtonText, textStyle]}>
          {label}
        </Text>
      ) : (
        <ActivityIndicator color={Colors.grayscale[0]} />
      )}
    </TouchableOpacity>
  );
};

export const SignInWithButton = ({ type, onPress }) => {
  switch (type) {
    case "Google":
      return (
        <TouchableOpacity onPress={onPress} style={buttonStyle.field}>
          <AssetImage
            asset={LavAssets.google}
            width={30}
            height={30}
            containerStyle={{ marginRight: 10 }}
          />
          <Text style={buttonStyle.text}>Sign In with Google</Text>
        </TouchableOpacity>
      );
    case "Apple":
      return (
        <TouchableOpacity onPress={onPress} style={buttonStyle.field}>
          <AssetImage
            asset={LavAssets.apple}
            width={30}
            height={30}
            containerStyle={{ marginRight: 10 }}
          />
          <Text style={buttonStyle.text}>Sign In with Apple</Text>
        </TouchableOpacity>
      );

    default:
      return <></>;
  }
};

export const OutlinedButton = ({
  label,
  style,
  onPress,
  asset,
  fill,
  stroke,
  enabled = true,
  isLoading = false,
  onEnlargedStyle = false,
  imageWidth,
  imageHeight = 16,
  imageContainerStyle,
  textStyle,
  onShadowStyle,
}) => {
  return (
    <TouchableOpacity
      disabled={!enabled || isLoading}
      onPress={onPress}
      style={[
        buttonStyle.outlinedButton,
        !enabled && !isLoading && buttonStyle.disabledButton,
        style,
        onShadowStyle && buttonStyle.shadow,
      ]}
    >
      {asset && (
        <AssetImage
          asset={asset}
          width={imageWidth ?? imageHeight}
          height={imageHeight}
          fill={fill}
          stroke={stroke}
          containerStyle={[imageContainerStyle]}
        />
      )}
      {!isLoading ? (
        <Text
          style={[
            buttonStyle.outlinedText,
            textStyle,
            !onEnlargedStyle && buttonStyle.smallText,
          ]}
        >
          {label}
        </Text>
      ) : (
        <ActivityIndicator color={Colors.grayscale[0]} />
      )}
    </TouchableOpacity>
  );
};

const buttonStyle = StyleSheet.create({
  field: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    width: "100%",
    borderRadius: 12,
    backgroundColor: Colors.grayscale[0],
    elevation: 0,
    paddingHorizontal: normalize(20, "height"),
    fontSize: 22,
    fontFamily: "Roboto-Regular",
    marginBottom: 15,
  },

  primaryBlue: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: "100%",
    borderRadius: 8,
    backgroundColor: Colors.primary[900],
    elevation: 1,
    fontSize: 14,
  },

  transparentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: "100%",
    borderRadius: 8,
    backgroundColor: "transparent",
    elevation: 1,
    fontSize: 14,
    fontFamily: "Roboto-Bold",
  },

  outlinedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: "100%",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary[900],
    backgroundColor: Platform.select({
      ios: "transparent",
      android: Colors.grayscale[0],
    }),
    elevation: 1,
    fontSize: 14,
    // paddingHorizontal: 30,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontFamily: "Roboto-Regular",
    fontSize: 22,
  },
  smallText: {
    fontFamily: "Roboto-Bold",
    fontSize: 16,
  },
  primaryRedText: {
    fontFamily: "Roboto-Bold",
    fontSize: 22,
    color: Colors.grayscale[0],
  },
  primaryBlueText: {
    fontFamily: Platform.select({
      ios: "Roboto",
      android: "Roboto-Regular",
    }),
    fontWeight: Platform.select({ ios: "500" }),
    fontSize: 14,
    color: Colors.grayscale[0],
  },
  outlinedText: {
    fontFamily: Platform.select({ ios: "Roboto", android: "Roboto-Bold" }),
    fontSize: normalize(15),
    color: Colors.primary[900],
  },
  transparentButtonText: {
    fontFamily: Platform.select({
      ios: "Roboto",
      android: "Roboto-Medium",
    }),
    fontWeight: Platform.select({ ios: "500" }),
    color: Colors.primary[900],
    fontSize: 14,
  },

  outlinedText: {
    fontFamily: Platform.select({
      ios: "Roboto",
      android: "Roboto-Regular",
    }),
    fontWeight: Platform.select({ ios: "500" }),
    fontSize: 14,
    color: Colors.primary[900],
  },

  shadow: {
    shadowColor: Colors.GRAY,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
    elevation: 3,
  },
});
