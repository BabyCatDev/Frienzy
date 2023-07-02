import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { AssetImage } from "../../assets/asset_image";
import Assets from "../../assets";

export const PlusButton = ({ onPress, isDisabled = false }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled}>
      <View style={styles.containerStyle}>
          <AssetImage
            asset={Assets.plusIcon}
            width={50}
            height={50}
          />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    width: 120,
    height: 120,
    backgroundColor: "#FB5F2D",
    alignItems: "center",
    justifyContent: "center"
  },
});