import React, { useState, useRef } from "react";
import Assets from "../../assets";
import { AssetImage } from "../../assets/asset_image";
import { Colors, Sizes } from "../../utils/AppConstants";
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import Localization from "../../services/LocalizationService";
import { useDispatch } from "react-redux";

import { loginUser } from "../../store/slices/AuthSlice";
import { useSelector } from "react-redux";


const LoginForm = () => {
  const [isFocusLogin, setIsFocusLogin] = useState(false);
  const [isFocusPass, setIsFocusPass] = useState(false);
  const lastNameRef = useRef();
  const { width } = useWindowDimensions();

  const dispatch = useDispatch();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const isLoading = useSelector((state) => state.auth.isLoading);
  const error = useSelector((state) => state.auth.error);

  const onLogin = () => {
    dispatch(loginUser({ login, password }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" && "padding"}
      style={{
        ...styles.form,
        flex: width > 525 ? 0 : 1,
        width: width > 525 ? 407 : width,
        height: width > 525 ? 264 : "auto",
        position: width > 525 ? "relative" : "absolute",
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            width: width > 525 ? 407 : width,
            height: width > 525 ? 264 : "auto",
          }}
        >
          <View style={styles.containerForm}>
            <TextInput
              onChangeText={(text) => setLogin(text)}
              defaultValue={login}
              style={{
                ...styles.textInput,
                borderColor: isFocusLogin
                  ? Colors.primary[900]
                  : Colors.grayscale[100],
                marginBottom: 12,
              }}
              placeholder={Localization.getString("login", "login")}
              autoCapitalize="none"
              placeholderTextColor={Colors.grayscale[400]}
              onFocus={() => setIsFocusLogin(true)}
              onBlur={() => setIsFocusLogin(false)}
              onSubmitEditing={() => {
                lastNameRef.current.focus();
              }}
            />
            <TextInput
              ref={lastNameRef}
              onChangeText={(text) => setPassword(text)}
              defaultValue={password}
              style={{
                ...styles.textInput,
                borderColor: isFocusPass
                  ? Colors.primary[900]
                  : Colors.grayscale[100],
              }}
              autoCapitalize="none"
              placeholder={Localization.getString("login", "password")}
              secureTextEntry={true}
              placeholderTextColor={Colors.grayscale[400]}
              onFocus={() => setIsFocusPass(true)}
              onBlur={() => setIsFocusPass(false)}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity onPress={onLogin}>
              <View style={styles.button}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.grayscale[0]} />
                ) : (
                  <Text style={styles.buttonText}>
                    {Localization.getString("login", "signIn")}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const LoginScreen = () => {
  const { width, height } = useWindowDimensions();
  return (
    <View
      style={{
        flex: 1,
        width: width,
        paddingTop: width > 525 ? 0 : 0,
        backgroundColor: Colors.grayscale[100],
        alignItems: width > 525 ? "center" : "flex-start",
        justifyContent: width > 525 ? "center" : "center",
      }}
    >
      <View
        style={{
          ...styles.container,
          display: width > 525 ? "flex" : "flex",
          width: width,
          position: width > 525 ? "absolute" : "relative",
          top:
            width > 744
              ? height / 4 - 264 / 4 - 16
              : width > 525
              ? height / 2 - 264 / 2 - 16 - 120
              : 0,
          height: width > 525 ? 32 : 185,
          justifyContent: width > 525 ? "flex-start" : "flex-start",
        }}
      >
      </View>

      <LoginForm />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  backgroundImage: {
    flex: 1,
    position: "relative",
    zIndex: 2,
  },
  chamomile: {
    width: 74.56,
    height: 73.4,
    position: "absolute",
    left: 210,
    top: -10,
  },
  branchRight: {
    position: "absolute",
    width: 70,
    height: 160,
    left: 0,
    top: 341,
  },
  branchLeft: {
    position: "absolute",
    width: 70,
    height: 125,
    right: 0,
    top: 360,
  },
  form: {
    backgroundColor: Colors.primary[100],
    bottom: 0,
    borderRadius: 24,
    zIndex: 200,
  },
  containerForm: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 50,
    paddingTop: 24,
    backgroundColor: Colors.primary[100],
    borderRadius: 24,
  },
  chamomileForm: {
    position: "absolute",
    width: 74,
    height: 73,
    left: 192,
    top: -50,
  },
  branchRightForm: {
    position: "absolute",
    width: 60,
    height: 130,
    right: -55,
    top: 100,
  },
  branchLeftForm: {
    position: "absolute",
    width: 55,
    height: 115,
    left: -50,
    top: 90,
  },
  titleForm: {
    color: "#1D3145",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
    marginBottom: 16,
  },
  textForm: {
    color: "#1D3145",
    fontSize: Sizes.medium,
    fontWeight: "400",
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 5,
  },
  textInput: {
    color: "#1D3145",
    paddingBottom: 11,
    paddingLeft: 16,
    paddingTop: 11,
    borderWidth: 1,
    borderRadius: 12,
  },
  error: {
    color: Colors.additional.red[70],
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 20,
    marginTop: 5,
  },
  button: {
    width: "100%",
    backgroundColor: Colors.primary[900],
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: Colors.grayscale[0],
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    textAlign: "center",
  },
});
