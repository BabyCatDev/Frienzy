import { connect } from "react-redux";

import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { hideOverlay, showOverlay } from "../../store/slices/OverlaySlice";

const OverlayScreen = (props) => {
  //   const animation = useRef(new Animated.Value(0)).current
  const [showContainer, setShowContainer] = useState(false);

  useEffect(() => {
    if (props.onShow) {
      setShowContainer(true);
      //   Animated.timing(animation, {
      //     toValue: 1,
      //     duration: 200,
      //     useNativeDriver: true,
      //   }).start()
    } else {
      //   Animated.timing(animation, {
      //     toValue: 0,
      //     duration: 200,
      //     useNativeDriver: true,
      //   }).start(() => setShowContainer(false))
      setShowContainer(false);
    }
  }, [props.onShow]);

  const animatedStyle = {
    //   opacity: animation,
    position: "absolute",
    width: "100%",
    height: showContainer ? "100%" : "0%",
    // backgroundColor: Colors.GOLD,
  };

  return (
    <View style={animatedStyle}>
      <View
        // blurType={'light'}
        // blurAmount={20}
        // reducedTransparencyFallbackColor={Colors.GRAY}
        style={styles.container}
      >
        <TouchableOpacity onPress={props.hideOverlay} style={animatedStyle} />

        <Text style={{ fontSize: 35 }}>{props.title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    elevation: 10,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
    // opacity: 0.9,
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    showOverlay: () => {
      dispatch(showOverlay());
    },
    hideOverlay: () => {
      dispatch(hideOverlay());
    },
  };
};

const mapStateToProps = (state) => {
  return {
    onShow: state.overlay.onShow,
    title: state.overlay.title,
    description: state.overlay.description,
    actions: state.overlay.actions,
    navigation: state.overlay.navigation,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OverlayScreen);
