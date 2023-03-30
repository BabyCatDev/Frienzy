import * as React from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PropTypes from "prop-types";
import { Colors } from "../utils/Colors";
import LinearGradient from "react-native-linear-gradient";
import normalize from "react-native-normalize";
import { Line } from "react-native-svg";

const Toggle = (props) => {
  const animatedValue = new Animated.Value(0);

  const moveToggle = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  });

  const { isOn, onColor, offColor, style, onToggle, labelStyle, label } = props;

  const color = isOn ? onColor : offColor;

  animatedValue.setValue(isOn ? 0 : 1);
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  return (
    <View style={styles.container}>
      {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <TouchableOpacity onPress={onToggle}>
        <View
          // colors={color}
          style={[styles.toggleContainer, style, { backgroundColor: color }]}
        ></View>
        <Animated.View
          style={[
            styles.toggleWheelStyle,
            {
              marginLeft: moveToggle,
              position: "absolute",
            },
          ]}
        >
          <LinearGradient
            colors={Colors.mainGradient}
            useAngle={true}
            angle={316.53}
            style={{
              width: normalize(22),
              height: normalize(22),
              borderRadius: normalize(20),
            }}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

Toggle.propTypes = {
  onColor: PropTypes.string,
  offColor: PropTypes.string,
  label: PropTypes.string,
  onToggle: PropTypes.func,
  style: PropTypes.object,
  isOn: PropTypes.bool.isRequired,
  labelStyle: PropTypes.object,
};

Toggle.defaultProps = {
  onColor: "green", //Colors.additional.green[100],
  offColor: "red", //Colors.grayscale[300],
  label: "",
  onToggle: () => {},
  style: {},
  isOn: false,
  labelStyle: {},
};

export const MemoToggle = React.memo(Toggle);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 28,
    // backgroundColor: 'green',
    // justifyContent: "center",
  },
  toggleContainer: {
    width: 48,
    height: 28,
    // marginLeft: 3,
    borderRadius: 14,
    // justifyContent: "center",
    // alignItems: "center",
  },
  label: {
    marginRight: 2,
  },
  toggleWheelStyle: {
    width: 24,
    height: 24,
    // backgroundColor: Colors.grayscale[100],
    borderRadius: 16,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 2.5,
    // elevation: 1.5,
  },
});
