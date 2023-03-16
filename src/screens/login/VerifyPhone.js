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
import { loginUser, getCode } from "../../auth0";

const VerifyPhone = ({ navigation }) => {
  const [code, setCode] = useState("");
  const { height, width } = useWindowDimensions();
  const { user } = useSelector((state) => state.auth);

  const onContinue = () => {
    loginUser(user.phone, code, () => navigation.navigate("UserProfile"));
  };
  const onResend = () => {
    getCode(user.phone);
  };

  return (
    <LinearGradient colors={Colors.backgroundGradient} style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        extraScrollHeight={75}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === "ios"}
      >
        <View
          style={{
            ...AppStyles.loginContainer,
            paddingTop: height * 0.13,
            paddingBottom: height * 0.28,
          }}
        >
          <Text style={AppStyles.header40}>{"Let's\nRegister You!"}</Text>
          <View
            style={{
              alignItems: "center",
              width: "100%",
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
              style={{ ...AppStyles.textInput, marginBottom: normalize(18) }}
              placeholder="Code"
              placeholderTextColor={Colors.darkText}
            />
            <Pressable
              style={{ alignSelf: "flex-end" }}
              onPress={() => onResend()}
            >
              <Text style={AppStyles.text16}>Resend code</Text>
            </Pressable>
            <MainButton title={"CONTINUE"} onPress={() => onContinue()} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default VerifyPhone;
