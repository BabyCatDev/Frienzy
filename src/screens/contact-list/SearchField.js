import React from "react";
import { View, TextInput } from "react-native";
import { Colors } from "../../utils/Colors";
import { AppStyles } from "../../utils/AppStyles";
import Assets from "../../assets";
import { AssetImage } from "../../assets/asset_image";
import normalize from "react-native-normalize";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

const SearchField = ({ search, setSearch, scrollY, containerStyle }) => {
  // const animatedStyles = useAnimatedStyle(() => {
  //   const opacity = interpolate(scrollY.value, [0, 50], [1, 0], {
  //     extrapolateRight: Extrapolation.CLAMP,
  //   });

  //   return {
  //     // transform: [{ scale: scale }],
  //     opacity: opacity,
  //     transform: [
  //       {
  //         translateY: interpolate(
  //           scrollY.value,
  //           [0, 50],
  //           [0, -50],
  //           Extrapolation.CLAMP
  //         ),
  //       },
  //     ],
  //   };
  // });
  return (
    <View
      style={{
        // ...animatedStyles,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          backgroundColor: "#221F2D",
          paddingRight: 15,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          marginTop: normalize(25),
          // position: "absolute",
        }}
      >
        <TextInput
          placeholder="Name, phone or card number"
          placeholderTextColor={"#403D4B"}
          value={search}
          onChangeText={setSearch}
          style={{
            // ...AppStyles.textInput,
            flex: 1,
            backgroundColor: "#221F2D",
            fontFamily: "Poppins-Medium",
            fontSize: normalize(15),
            lineHeight: normalize(18.2),
            // marginTop: 20,
            // height: 50,
            color: "#EEF0FF",
            paddingVertical: 11,
            borderRadius: 10,
            paddingLeft: 15,
            // paddingRight: 15,
          }}
        />
        <AssetImage
          // asset={Assets.searchIcon}
          asset={Assets.searchIcon}
          width={normalize(21)}
          height={normalize(20)}
        />
      </View>
    </View>
  );
};

export default SearchField;
