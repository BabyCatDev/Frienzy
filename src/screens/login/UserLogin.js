import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  TextInput,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../utils/Colors";
import { MainButton } from "../../components/main_button";
import { AppStyles } from "../../utils/AppStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import { storePhone } from "../../store/slices/AuthSlice";
import { getCode } from "../../auth0";
import { useFocusEffect } from "@react-navigation/native";

const UserLogin = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { height, width } = useWindowDimensions();
  
useFocusEffect(
    React.useCallback(() => {
      setPhoneNumber("");
    }, []
))
  
  const dispatch = useDispatch();

  const onContinue = () => {
    dispatch(storePhone({ phoneNumber }));
    getCode(phoneNumber, () => {
      navigation.navigate("VerifyPhone");
    });
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
            <Text style={AppStyles.header20}>Enter phone number</Text>
            <Text style={AppStyles.text15}>
              Log in to SocialNav to proceed to use
            </Text>
            <TextInput
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              style={AppStyles.textInput}
              placeholder="Phone Number"
              placeholderTextColor={Colors.darkText}
            />
            <MainButton title={"CONTINUE"} onPress={() => onContinue()} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default UserLogin;
