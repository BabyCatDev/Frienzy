import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { AssetImage } from "../../assets/asset_image";
import Assets from "../../assets";
import normalize from "react-native-normalize";

export const Header = ({
  title,
  containerStyle,
  onPressLeft,
  onPressRight,
  rightIcon,
  friendsCounter,
  rightWidth,
  rightHeight,
  navigation,
}) => {
  console.log("navigation", navigation);
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        // justifyContent: "center",
        justifyContent: "space-between",
        // alignItems: "flex-start",
        // backgroundColor: 'green',
        ...containerStyle,
      }}
    >
      <Pressable
        style={{
          width: normalize(27),
          height: normalize(27),
          // justifyContent: "center",
        }}
        onPress={() => navigation.canGoBack() && navigation.goBack()}
      >
        <AssetImage
          asset={Assets.arrowBack}
          width={normalize(12)}
          height={normalize(23)}
        />
      </Pressable>
      <View style={{ width: "71%", flexGrow: 1 }}>
        <Text
          style={{
            color: "#EEF0FF",
            fontSize: normalize(22),
            lineHeight: normalize(27),
            fontFamily: "Poppins-SemiBold",
            textAlign: "center",
          }}
        >
          {title}
        </Text>
        {friendsCounter && (
          <Text
            style={{
              color: "#9496A2",
              textAlign: "center",
              fontSize: normalize(17),
              lineHeight: normalize(20.62),
              fontFamily: "Poppins-Medium",
            }}
          >
            {friendsCounter}
          </Text>
        )}
      </View>
      <Pressable
        style={{
          width: normalize(27),
          height: normalize(27),
          // justifyContent: "center",
          alignItems: "flex-end",
        }}
        onPress={onPressRight}
      >
        {rightIcon && (
          <AssetImage
            asset={rightIcon}
            width={normalize(rightWidth)}
            height={normalize(rightHeight)}
          />
        )}
      </Pressable>
    </View>
  );
};
