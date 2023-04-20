import React, { useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import normalize from "react-native-normalize";
import { Colors } from "../../utils/Colors";
import { MainButton } from "../../components/main_button";
import { AppStyles } from "../../utils/AppStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import AuthProvider from "../../utils/AuthProvider";
import store from "../../store";
import { autoLoginUser } from "../../store/slices/AuthSlice";
import FGLocationRetriever from "../../services/FGLocationRetriever";
import { getValue } from "../../utils/AsyncStore";
import FBSaver from "../../services/FBSaver";

const VerifyPhone = ({ navigation }) => {
  const [code, setCode] = useState("");
  const { height } = useWindowDimensions();
  const { user } = useSelector((state) => state.auth);
  const scrollRef = React.useRef();
  const isAndroid = Platform.OS === "android";
  const [isChange, setIsChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onContinue = async () => {
    setIsLoading(true);
    let phone = null;
    let token = null;
    try {
      phone = await getValue("phoneNumber");
      await AuthProvider.loginUser(phone, code);
      token = await AuthProvider.getToken(phone, code);
      await FBSaver.getInstance().createUser();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      return;
    }
    if (token) {
      FGLocationRetriever.getInstance().setUserPhone(phone);
      store.dispatch(autoLoginUser(token));
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
        keyboardShouldPersistTaps={'handled'}
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
            <TouchableOpacity
              style={{ alignSelf: "flex-end", marginBottom: normalize(40) }}
              // disabled
              onPress={() => onResend()}
            >
              <Text
                style={AppStyles.medium16}
              >
                Resend code
              </Text>
            </TouchableOpacity>
            <MainButton
              isLoading={isLoading}
              title={"CONTINUE"}
              onPress={() => onContinue()}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default VerifyPhone;
