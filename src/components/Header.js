import React from "react";
import { View, Text, Pressable } from "react-native";
import Ionicon from "react-native-vector-icons/Ionicons";
import normalize from "react-native-normalize";
import { AppStyles } from "../utils/AppStyles";

export const Header = ({
  title,
  containerStyle,
  onPressLeft,
  onPressRight,
  rightIcon,
  leftIcon,
  friendsCounter,
  rightWidth,
  rightHeight,
  navigation,
  noBackButton,
}) => {
  return (
    <View
      style={{
        ...AppStyles.headerContainer,
        ...containerStyle,
      }}
    >
      {noBackButton ? leftIcon ? (
        <Pressable style={AppStyles.headerRightIcon} onPress={onPressLeft}>
          {leftIcon()}
        </Pressable>
      ) : (
        <View style={{ width: normalize(27), height: normalize(27) }} />
      ) : (
        <Pressable
          style={{
            width: normalize(27),
            height: normalize(27),
          }}
          onPress={() => navigation.canGoBack() && navigation.pop()}
        >
          <Ionicon name={"chevron-back-outline"} size={normalize(20)} color={"white"} />
        </Pressable>
      )}
      <View style={{ width: "71%", flexGrow: 1 }}>
        <Text style={{ ...AppStyles.semibold22, textAlign: "center" }}>
          {title}
        </Text>
        {friendsCounter && (
          <Text style={{ ...AppStyles.medium17, textAlign: "center" }}>
            {friendsCounter}
          </Text>
        )}
      </View>
      <Pressable style={AppStyles.headerRightIcon} onPress={onPressRight}>
        {rightIcon && rightIcon()}
      </Pressable>
    </View>
  );
};
