import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AssetImage } from "../../assets/asset_image";
import Assets from "../../assets";
import normalize from "react-native-normalize";

export const PrefixPicker = ({ onPress, containerStyle, selectedPrefix }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: "row", ...containerStyle }}
      onPress={onPress}
    >
      <View style={styles.prefixContainer}>
        <Text style={styles.prefixTypo}>{selectedPrefix}</Text>
        <AssetImage
          asset={Assets.pickerArrow}
          width={normalize(6)}
          height={normalize(6)}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  prefixContainer: {
    paddingLeft: 20,
    paddingRight: 5,
    paddingVertical: 16,
    marginTop: 2,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  prefixTypo: {
    fontFamily: "Poppins-Medium",
    fontSize: normalize(16),
    lineHeight: normalize(24),
    color: "#EEF0FF",
    marginRight: normalize(5),
  },
});
