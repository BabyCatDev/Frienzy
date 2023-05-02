import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  TextInput,
  Platform,
  LayoutAnimation,
  TouchableOpacity
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../utils/Colors";
import { MainButton } from "../../components/mainButton";
import { AppStyles } from "../../utils/AppStyles";
import { useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from "@react-navigation/native";
import normalize from "react-native-normalize";
import { PrefixPicker } from "./PrefixPicker";
import { Picker } from "@react-native-picker/picker";
import countries from "../../utils/country-phone-codes.json";
import { signInUpWithPhone } from "../../redux/actions/auth/SignUp";

const UserLogin = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false)

  const { height } = useWindowDimensions();
  const scrollRef = useRef();
  const [isChange, setIsChange] = useState(false);
  const [selectedPrefix, setSelectedPrefix] = useState("+1");
  const [pickerVisible, setPickerVisible] = useState(false);
  const isAndroid = Platform.OS === "android";
  const pickerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [confirm, setConfirm] = useState(null);

  useFocusEffect(
    useCallback(() => {
      setPhoneNumber("");
    }, [])
  );

  const sendMessage = async () => {
    const confirmation = await auth().signInWithPhoneNumber(selectedPrefix + phoneNumber);
    setConfirm(confirmation)
    setShowCode(true);
  }

  const verifyCode = async () => {
    try {
      console.log("Verifying")
      await dispatch(signInUpWithPhone(confirm, code));
      // const user = await confirm.confirm(code)
      // await createUser(user);
    } catch (error) {
      console.log("Invalid code", error)
    }
  }

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
          <Text style={{ 
            ...AppStyles.semibold40, 
            alignSelf: "flex-start", 
            fontFamily: "NewOrder-Bold", 
            marginBottom: normalize(10)
          }}>Hey There!
          </Text>
          <Text style={{ ...AppStyles.semibold20, width: "100%" }}>
              Welcome to Frienzy
            </Text>
          <View style={{...AppStyles.loginForm}}>
            <Text
              style={{
                ...AppStyles.medium15,
                marginBottom: normalize(8),
                textAlign: "left",
                width: "100%",
                fontSize: 13
              }}
            >
              {!showCode ? "Enter your phone number to continue" : "Enter the confirmation code"}
            </Text>
            {showCode ? (
              <>
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
                  onPress={() => sendMessage()}
                >
                  <Text
                    style={AppStyles.medium16}
                  >
                    Resend code
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View
                style={{
                  marginBottom: isAndroid
                    ? normalize(82)
                    : pickerVisible
                    ? 0
                    : normalize(82),
                  ...AppStyles.loginInputContainer,
                }}
              >
                {!isAndroid ? (
                  <PrefixPicker
                    selectedPrefix={selectedPrefix}
                    containerStyle={{
                      alignSelf: "center",
                    }}
                    onPress={() => {
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.easeInEaseOut
                      );

                      setPickerVisible(!pickerVisible);
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width:
                        selectedPrefix.length < 3
                          ? "30%"
                          : selectedPrefix.length < 4
                          ? "35%"
                          : "40%",
                      zIndex: 0,
                      borderRadius: 10,
                    }}
                  >
                    <Picker
                      ref={pickerRef}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      prompt="Select Country"
                      dropdownIconColor={"#EEF0FF"}
                      selectedValue={selectedPrefix}
                      onFocus={() => {
                        LayoutAnimation.configureNext(
                          LayoutAnimation.Presets.easeInEaseOut
                        );
                        setPickerVisible(true);
                      }}
                      onBlur={() => {
                        LayoutAnimation.configureNext(
                          LayoutAnimation.Presets.easeInEaseOut
                        );
                        setPickerVisible(false);
                      }}
                      onValueChange={(itemValue, itemIndex) => {
                        setSelectedPrefix(itemValue);
                      }}
                    >
                      {!pickerVisible ? (
                        <Picker.Item
                          fontFamily="Poppins-Regular"
                          label={selectedPrefix}
                          value={selectedPrefix}
                          key={selectedPrefix}
                          color={"#EEF0FF"}
                        />
                      ) : (
                        countries.map((c) => {
                          return (
                            <Picker.Item
                              fontFamily="Poppins-Regular"
                              label={c.country + " " + c.code}
                              value={c.code}
                              key={c.country}
                              color={"#EEF0FF"}
                              style={{ backgroundColor: "black" }}
                            />
                          );
                        })
                      )}
                    </Picker>
                  </View>
                )}
                <TextInput
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(text)}
                  style={{ ...AppStyles.loginTextInput, ...AppStyles.medium16 }}
                  onFocus={() => {
                    setIsChange(true);
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut
                    );
                    setPickerVisible(false);
                  }}
                />
              </View>
            )}
            {pickerVisible && !isAndroid && (
              <View
                style={{
                  width: "100%",
                }}
              >
                <Picker
                  prompt="Select Country"
                  dropdownIconColor={"#EEF0FF"}
                  itemStyle={{ fontFamily: "Poppins-Regular" }}
                  selectedValue={selectedPrefix}
                  onValueChange={(itemValue, itemIndex) => {
                    setSelectedPrefix(itemValue);
                  }}
                >
                  {countries.map((c) => {
                    return (
                      <Picker.Item
                        fontFamily="Poppins-Regular"
                        label={c.country + " " + c.code}
                        value={c.code}
                        key={c.country}
                        color={"#EEF0FF"}
                        style={{ backgroundColor: "black" }}
                      />
                    );
                  })}
                </Picker>
              </View>
            )}
            {showCode ? (
              <MainButton
              title="SIGN IN"
              isLoading={isLoading}
              onPress={() => verifyCode()}
            />
            ) : (
              <MainButton
              title="CONTINUE"
              isLoading={isLoading}
              onPress={() => sendMessage()}
            />
            )}
            
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default UserLogin;
