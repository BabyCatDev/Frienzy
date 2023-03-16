import React from "react";
import { AssetImage } from "../assets/asset_image";
import Assets from "../assets";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Colors, Sizes } from "../utils/AppConstants";
import { Strings } from "../utils/Localizations";
import Localization from "../services/LocalizationService";

export const DownloadButton = ({
  icon = Assets.check,
  onPress,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[styles.touchable, { opacity: disabled ? 0.3 : 1 }]}
      onPress={onPress}
      disabled={!onPress || disabled}
    >
      <AssetImage
        asset={icon}
        width={22}
        height={22}
        stroke={Colors.primary[900]}
      />
      <Text style={styles.buttonText}>
        {Localization.getString("common", "downloadPhoto")}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flexDirection: "row",
    paddingHorizontal: 12,
    height: 32,
    alignItems: "center",
  },
  buttonText: {
    marginHorizontal: 8,
    color: Colors.primary[900],
    fontFamily: Platform.select({ ios: "Roboto", android: "Roboto-Medium" }),
    fontWeight: Platform.select({ ios: "500", android: undefined }),
    fontSize: 14,
  },
});
