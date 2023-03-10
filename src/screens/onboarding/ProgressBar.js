import React from "react";

import { View, StyleSheet } from "react-native";
import { Sizes, Colors } from "../../utils/AppConstants";

function ProgressBar({ index }) {
  return (
    <View style={styles.progressBar}>
      <View
        style={[
          styles.progressLine,
          {
            borderColor:
              index == 0 ? Colors.primary[900] : Colors.grayscale[200],
          },
        ]}
      ></View>
      <View
        style={[
          {
            marginHorizontal: 3.5,
          },
        ]}
      ></View>
      <View
        style={[
          styles.progressLine,
          {
            borderColor:
              index == 1 ? Colors.primary[900] : Colors.grayscale[200],
          },
        ]}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: Sizes.medium,
    marginTop: Sizes.medium,
  },
  progressLine: {
    borderWidth: 2,
    borderRadius: 2,
    flex: 1,
  },
});

export default ProgressBar;
