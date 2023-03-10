import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { AssetImage } from "../assets/asset_image";
import LavAssets from "../assets";
import { Colors, Sizes } from "../utils/AppConstants";

export const LavDropdownInput = ({
  title,
  text,
  onChangeText,
  editable,
  style,
  titleStyle,
  placeholder,
  onPress,
  placeholderTextColor = Colors.grayscale[300],
  leftIcon,
  iconColor,
}) => {
  return (
    <View style={[{ marginTop: 16 }, style]}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}

      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
          onPress();
        }}
      >
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
        <View pointerEvents="none">
          <TextInput
            style={{ ...styles.input, paddingLeft: leftIcon ? 46 : 16 }}
            value={text}
            editable={editable}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
          />
        </View>

        <AssetImage
          asset={LavAssets.downArrow}
          width={24}
          height={24}
          containerStyle={{
            position: "absolute",
            alignSelf: "flex-end",
            right: Sizes.medium,
            top: 14,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    paddingVertical: 11,
    paddingHorizontal: Sizes.medium,
    borderColor: Colors.grayscale[100],
    backgroundColor: Colors.grayscale[0],
    fontSize: 16,
    color: Colors.grayscale[900],
    fontFamily: Platform.select({
      ios: "Roboto",
      android: "Roboto-Regular",
    }),
    fontWeight: Platform.select({ ios: "400" }),
    borderRadius: 12,
    marginTop: 4,
    height: 44,
  },
  title: {
    fontWeight: Platform.select({ ios: "400", android: undefined }),
    fontFamily: Platform.select({ ios: "Roboto", android: "Roboto-Regular" }),
    fontSize: Sizes.medium,
    color: Colors.grayscale[400],
    lineHeight: 22,
  },
  leftIcon: {
    position: "absolute",
    bottom: 10,
    left: 15,
    zIndex: 100,
  },
});
