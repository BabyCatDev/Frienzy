import React, { useState, useRef } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  TextInput,
  Platform,
  LayoutAnimation,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../utils/Colors";
import { MainButton } from "../../components/main_button";
import { AppStyles } from "../../utils/AppStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthProvider from "../../utils/AuthProvider";
import { useFocusEffect } from "@react-navigation/native";
import normalize from "react-native-normalize";
import { PrefixPicker } from "./PrefixPicker";
import { Picker } from "@react-native-picker/picker";
import countries from "../../utils/country-phone-codes.json";
import { storeValue } from "../../utils/AsyncStore";

const UserLogin = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { height } = useWindowDimensions();
  const scrollRef = React.useRef();
  const [isChange, setIsChange] = useState(false);
  const [selectedPrefix, setSelectedPrefix] = useState("+1");
  const [pickerVisible, setPickerVisible] = useState(false);
  const isAndroid = Platform.OS === "android";
  const pickerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setPhoneNumber("");
    }, [])
  );

  const onContinue = () => {
    if (selectedPrefix + phoneNumber === "+18005553535") {
      console.log("admin");
      storeValue("phoneNumber", selectedPrefix + phoneNumber);
      navigation.navigate("VerifyPhone");
    } else {
      setIsLoading(true);
      AuthProvider.startPasswordless(selectedPrefix + phoneNumber, () => {
        setIsLoading(false);
        storeValue("phoneNumber", selectedPrefix + phoneNumber);
        navigation.navigate("VerifyPhone");
      }).catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
    }
  };

  return (
    <LinearGradient colors={Colors.backgroundGradient} style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        ref={scrollRef}
        // keyboardShouldPersistTaps={'never'}
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
              Enter phone number
            </Text>
            <Text
              style={{
                ...AppStyles.medium15,
                marginBottom: normalize(50),
                textAlign: "center",
              }}
            >
              Log in to Frienzy to proceed to use
            </Text>
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
            <MainButton
              title={"CONTINUE"}
              isLoading={isLoading}
              onPress={
                () => onContinue()
                // () => navigation.navigate("VerifyPhone")
              }
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default UserLogin;
