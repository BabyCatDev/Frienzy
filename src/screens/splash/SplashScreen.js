import React, { useEffect } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Assets from "../../assets";
import { AssetImage } from "../../assets/asset_image";
import LinearGradient from "react-native-linear-gradient";
import normalize from "react-native-normalize";
import Animated from "react-native-reanimated";
import { Colors } from "../../utils/Colors";
import { AppStyles } from "../../utils/AppStyles";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const SplashScreen = ({ navigation }) => {
  const sharedWidth = useSharedValue(0);
  const { height } = useWindowDimensions();

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
    <LinearGradient colors={Colors.backgroundGradient} style={{ flex: 1 }}>
      <View
        style={{
          ...AppStyles.splashContainer,
          paddingTop: height * 0.18,
          paddingBottom: height * 0.21,
        }}
      >
        <AssetImage
          asset={Assets.logo}
          width={normalize(244)}
          height={normalize(299)}
        />
        <View style={AppStyles.progressBarContainer}>
          <Text
            style={{
              ...AppStyles.medium17,
              marginBottom: normalize(40),
            }}
          >
            Please wait...
          </Text>
          <View style={AppStyles.progressBar}>
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
