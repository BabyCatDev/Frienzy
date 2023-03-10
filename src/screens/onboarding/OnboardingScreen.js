import React, { useState, useEffect } from "react";

import { PageSlider } from "@pietile-native-kit/page-slider";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { Colors } from "../../utils/AppConstants";
import ProgressBar from "./ProgressBar";
import FirstScreen from "./FirstScreen";
import SecondScreen from "./SecondScreen";
import ThirdScreen from "./ThirdScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

function OnboardingScreen({ navigation }) {
  useEffect(() => {
    AsyncStorage.setItem("appLaunched", "true");
  }, []);

  const [selectedPage, setSelectedPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar index={selectedPage} />
      <PageSlider
        selectedPage={selectedPage}
        onSelectedPageChange={setSelectedPage}
        onCurrentPageChange={setCurrentPage}
      >
        <View style={styles.page}>
          <FirstScreen
            selectedPage={selectedPage}
            onSelectedPageChange={setSelectedPage}
          />
        </View>
        <View style={styles.page}>
          <ThirdScreen navigation={navigation} />
        </View>
      </PageSlider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    height: "100%",
  },
  container: {
    backgroundColor: Colors.grayscale[100],
  },
});

export default OnboardingScreen;
