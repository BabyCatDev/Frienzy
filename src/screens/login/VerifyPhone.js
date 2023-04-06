import React, { useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import normalize from "react-native-normalize";
import { Colors } from "../../utils/Colors";
import { MainButton } from "../../components/main_button";
import { AppStyles } from "../../utils/AppStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import AuthProvider from "../../utils/AuthProvider";
import { useEffect } from "react";
import store from "../../store";
import { autoLoginUser } from "../../store/slices/AuthSlice";
import FGLocationRetriever from "../../services/FGLocationRetriever";
import { getValue } from "../../utils/AsyncStore";

const VerifyPhone = ({ navigation }) => {
  const [code, setCode] = useState("");
  const { height } = useWindowDimensions();
  const { user } = useSelector((state) => state.auth);
  const scrollRef = React.useRef();
  const isAndroid = Platform.OS === "android";
  const [isChange, setIsChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // const getData = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('phoneNumber')
  //     if(value !== null) {
  //       console.log(value)
  //       return value;
  //     }
  //   } catch(e) {
  //     console.log(e)
  //   }
  // }

  const onContinue = async () => {
    setIsLoading(true);
    let phone = null;
    let token = null;
    try {
      phone = await getValue('phoneNumber');
      await AuthProvider.loginUser(phone, code);
      token = await AuthProvider.getToken();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      return
    }
    if (token) {
      FGLocationRetriever.getInstance().setUserPhone(phone);
      store.dispatch(autoLoginUser(token))
    }
    setIsLoading(false);
  };
  const onResend = () => {
    AuthProvider.startPasswordless(user.phone);
  };

  return (
    <LinearGradient colors={Colors.backgroundGradient} style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        ref={scrollRef}
        contentContainerStyle={{ minHeight: isChange ? "80%" : "100%" }}
        extraScrollHeight={isAndroid ? 0 : 75}
        onKeyboardDidShow={() => {
          isAndroid && scrollRef.current.scrollForExtraHeightOnAndroid(75);
        }}
        onKeyboardWillHide={() => !isAndroid && setIsChange(false)}
        onKeyboardDidHide={() => isAndroid && setIsChange(false)}
      >
        <View
          style={{ ...AppStyles.screenContainer, paddingTop: height * 0.13 }}
        >
          <Text style={{ ...AppStyles.semibold40, alignSelf: "flex-start" }}>
            {"Let's\nRegister You!"}
          </Text>
          <View style={AppStyles.loginForm}>
            <Text
              style={{ ...AppStyles.semibold20, marginBottom: normalize(16) }}
            >
              Enter code
            </Text>
            <Text
              style={{
                ...AppStyles.medium15,
                marginBottom: normalize(50),
                textAlign: "center",
              }}
            >
              We sent a confirmation code to your number
            </Text>
            <TextInput
              autoFocus={true}
              keyboardType="phone-pad"
              value={code}
              onChangeText={(text) => setCode(text)}
              style={{ ...AppStyles.textInput, ...AppStyles.medium16 }}
              placeholder="Code"
              placeholderTextColor={Colors.darkText}
              onFocus={() => {
                setIsChange(true);
              }}
            />
            <Pressable
              style={{ alignSelf: "flex-end" }}
              disabled
              onPress={() => onResend()}
            >
              <Text
                style={{ ...AppStyles.medium16, marginBottom: normalize(40) }}
              >
                Resend code
              </Text>
            </Pressable>
            {isLoading ? (
              <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={{ marginTop: normalize(20) }}
              />
            ) : (
            <MainButton
              title={"CONTINUE"}
              onPress={
                // () => navigation.navigate("UserProfile")
                () => onContinue()
              }
            />)}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default VerifyPhone;
