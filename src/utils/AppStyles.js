import normalize from "react-native-normalize";
import { Colors } from "./Colors";
import { StyleSheet } from "react-native";

export const AppStyles = {
  buttonTitle: {
    color: "white",
    fontSize: normalize(17),
    lineHeight: normalize(20.83),
    fontFamily: "Poppins-Semibold",
  },
  buttonOutline: {
    borderRadius: 50,
    paddingVertical: 1,
    paddingHorizontal: 1,
  },
  buttonContainer: {
    paddingVertical: 13,
    paddingHorizontal: 73,
    borderRadius: 50,
  },
  header40: {
    color: Colors.lightText,
    fontSize: normalize(40),
    lineHeight: normalize(49),
    fontFamily: "Poppins-Semibold",
    alignSelf: "flex-start",
  },
  header20: {
    color: Colors.lightText,
    fontSize: normalize(20),
    lineHeight: normalize(24.5),
    fontFamily: "Poppins-Semibold",
    marginBottom: normalize(16),
  },
  text15: {
    color: Colors.darkText,
    fontSize: normalize(15),
    lineHeight: normalize(18.2),
    fontFamily: "Poppins-Medium",
    // fontWeight: "500",
    marginBottom: normalize(50),
    textAlign: "center",
  },
  text16: {
    color: Colors.lightText,
    fontSize: normalize(16),
    lineHeight: normalize(24),
    fontFamily: "Poppins-Medium",
    letterSpacing: 0.15,
    marginBottom: normalize(40),
  },
  loginContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  textInput: {
    flex: 1,
    paddingRight: 20,
    paddingVertical: 16,
    fontSize: normalize(16),
    lineHeight: normalize(24),
    fontFamily: "Poppins-Medium",
    color: Colors.lightText,
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignSelf: 'center'
  },
};
