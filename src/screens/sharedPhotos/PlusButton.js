import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { AssetImage } from "../../assets/asset_image";
import Assets from "../../assets";

export const PlusButton = ({ onPress, isDisabled = false, isLoading = false }) => {
  return (    
    <View style={styles.containerStyle}>
      <TouchableOpacity onPress={onPress} disabled={isDisabled}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <AssetImage
            asset={Assets.plus}
            width={50}
            height={50}
          />
        )}
      </TouchableOpacity>    
    </View>
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
  imageStyle: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
});