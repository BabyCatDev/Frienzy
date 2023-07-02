import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";

export const PhotoItem = ({ onPress, photo, isDisabled=false}) => {
  console.log("photo", photo)
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity onPress={onPress} disabled={isDisabled}>
        <Image
          style={styles.imageStyle}
          width={120}
          height={120}
          source={{
            uri: photo.url 
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    width: 120,
    height: 120,
    backgroundColor: "#FB5F2D",
  },
  imageStyle: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
});