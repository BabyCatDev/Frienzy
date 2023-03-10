import React from "react";
import { View, StyleSheet } from "react-native";

function SecondScreen({ selectedPage, onSelectedPageChange }) {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SecondScreen;
