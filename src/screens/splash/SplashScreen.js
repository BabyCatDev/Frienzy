import React, { useEffect } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Platform,
} from "react-native";
import Assets from "../../assets";
import { AssetImage } from "../../assets/asset_image";
import LinearGradient from "react-native-linear-gradient";
import normalize from "react-native-normalize";
import Animated from "react-native-reanimated";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const SplashScreen = ({navigation}) => {
  const sharedWidth = useSharedValue(0);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    setTimeout(() => {
      // navigation.navigate("UserLogin");
    }, 500);
  }, []);

  // Platform.OS === "android" ? StatusBar.setBackgroundColor("#1A1822") : null;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: sharedWidth.value,
    };
  });
  const onProgress = () => {
    sharedWidth.value = withTiming(normalize(200), {
      duration: 500,
    });
  };
  useEffect(() => {
    onProgress();
  }, []);
  return (
    <LinearGradient
      colors={["#1A1822", "#12101A"]}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: height * 0.18,
          paddingBottom: height * 0.21,
        }}
      >
        <AssetImage
          asset={Assets.logo}
          width={normalize(244)}
          height={normalize(299)}
        />
        <View
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <Text
            style={{
              color: "#9496A2",
              // fontWeight: "500",
              fontSize: normalize(17),
              lineHeight: normalize(20.62),
              marginBottom: normalize(40),
              fontFamily: "Poppins-Medium",
            }}
          >
            Please wait...
          </Text>
          <View
            style={{
              height: normalize(6),
              width: normalize(200),
              borderRadius: normalize(32),
              backgroundColor: "#2C2937",
            }}
          >
            <Animated.View style={[animatedStyle]}>
              <LinearGradient
                useAngle={true}
                angle={132.35}
                colors={["#FF8579", "#FFA560"]}
                style={{
                  height: normalize(6),
                  borderRadius: normalize(32),
                }}
              />
            </Animated.View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;
