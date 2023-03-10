import React from "react";
import {StatusBar} from "react-native";
import {Colors} from "../utils/AppConstants";

export const LavStatusBar = () => (
  <StatusBar barStyle="dark-content" backgroundColor={Colors.grayscale[0]} />
);
