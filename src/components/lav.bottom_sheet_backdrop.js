import React, { useMemo } from "react";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Colors } from "../utils/AppConstants";

const LavBottomSheetBackdrop = (props) => {
  const MAX_OPACITY = 0.4;
  const MIN_OPACITY = 0;
  const {
    animatedIndex,
    style,
    appearsOnIndex,
    disappearsOnIndex,
    navigation,
  } = props;

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [MIN_OPACITY, MAX_OPACITY],
      [MIN_OPACITY, MAX_OPACITY],
      Extrapolate.CLAMP
    ),
  }));

  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: Colors.grayscale[900],
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <BottomSheetBackdrop
      {...props}
      onPress={() => {
        navigation?.popToTop();
      }}
      appearsOnIndex={appearsOnIndex ?? 0}
      disappearsOnIndex={disappearsOnIndex ?? -1}
    >
      <Animated.View style={containerStyle} />
    </BottomSheetBackdrop>
  );
};

export default LavBottomSheetBackdrop;
