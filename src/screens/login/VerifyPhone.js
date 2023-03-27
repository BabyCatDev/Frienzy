import React, { useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  TextInput,
  Pressable,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import normalize from "react-native-normalize";
import { Colors } from "../../utils/Colors";
import { MainButton } from "../../components/main_button";
import { AppStyles } from "../../utils/AppStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import AuthProvider from "../../utils/AuthProvider";
import { useEffect } from "react";
import { Auth } from "react-native-auth0";
import store from "../../store";
import { autoLoginUser } from "../../store/slices/AuthSlice";

const VerifyPhone = ({ navigation }) => {
  const [code, setCode] = useState("");
  const { height, width } = useWindowDimensions();
  const { user } = useSelector((state) => state.auth);
  const scrollRef = React.useRef();
  const isAndroid = Platform.OS === "android";
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  const onContinue = async() => {
    await AuthProvider.loginUser(user.phone, code);
    const token = await AuthProvider.getToken();
    if (token) {
      store.dispatch(autoLoginUser(token))
    }
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
          style={{
            ...AppStyles.loginContainer,
            paddingTop: height * 0.13,
          }}
        >
          <Text style={AppStyles.header40}>{"Let's\nRegister You!"}</Text>
          <View
            style={{
              alignItems: "center",
              width: "100%",
              marginTop: normalize(100),
            }}
          >
            <Text style={AppStyles.header20}>Enter code</Text>
            <Text style={AppStyles.text15}>
              We sent a confirmation code to your number
            </Text>
            <TextInput
              autoFocus={true}
              keyboardType="phone-pad"
              value={code}
              onChangeText={(text) => setCode(text)}
              style={{
                ...AppStyles.textInput,
                marginBottom: normalize(18),
                paddingHorizontal: 20,
                width: "100%",
              }}
              placeholder="Code"
              placeholderTextColor={Colors.darkText}
              onFocus={() => {
                setIsChange(true);
              }}
            />
            <Pressable
              style={{ alignSelf: "flex-end" }}
              onPress={() => onResend()}
            >
              <Text style={AppStyles.text16}>Resend code</Text>
            </Pressable>
            <MainButton
              title={"CONTINUE"}
              onPress={
                // () => navigation.navigate("UserProfile")
                () => onContinue()
              }
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default VerifyPhone;
