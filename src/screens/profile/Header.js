import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { AssetImage } from "../../assets/asset_image";
import Assets from "../../assets";
import normalize from "react-native-normalize";


export const Header = () => {
    return(
        <View
        style={{
          width: "100%",
          // backgroundColor: "red",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{
            width: normalize(27),
            height: normalize(27),
            justifyContent: "center",
            ...StyleSheet.absoluteFillObject,
          }}
          onPress={() => console.log("back")}
        >
          <AssetImage
            asset={Assets.arrowBack}
            width={normalize(9)}
            height={normalize(17)}
          />
        </Pressable>
        <Text
          style={{
            color: "white",
            fontSize: normalize(22),
            lineHeight: normalize(27),
            fontFamily: "Poppins-SemiBold",
          }}
        >
          Profile
        </Text>
      </View>
    )
    };