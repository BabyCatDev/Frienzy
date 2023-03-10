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
import { Colors } from "../utils/AppConstants";

const Toggle = (props) => {
  const animatedValue = new Animated.Value(0);

  const moveToggle = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const { isOn, onColor, offColor, style, onToggle, labelStyle, label } = props;

  const color = isOn ? onColor : offColor;

  animatedValue.setValue(isOn ? 0 : 1);
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  return (
    <View style={styles.container}>
      {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <TouchableOpacity onPress={onToggle}>
        <View
          style={[styles.toggleContainer, style, { backgroundColor: color }]}
        >
          <Animated.View
            style={[
              styles.toggleWheelStyle,
              {
                marginLeft: moveToggle,
              },
            ]}
          />
        </View>
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
  onColor: Colors.additional.green[100],
  offColor: Colors.grayscale[300],
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
  },
  toggleContainer: {
    width: 48,
    height: 28,
    // marginLeft: 3,
    borderRadius: 14,
    justifyContent: "center",
  },
  label: {
    marginRight: 2,
  },
  toggleWheelStyle: {
    width: 24,
    height: 24,
    backgroundColor: Colors.grayscale[100],
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
