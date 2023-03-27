import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Platform,
  StyleSheet,
  TextInput,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import normalize from "react-native-normalize";
import { Colors } from "../../utils/Colors";
import { AppStyles } from "../../utils/AppStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import { Avatar } from "./Avatar";
import { Header } from "./Header";
import { ProfileRow } from "./ProfileRow";
import AuthProvider from "../../utils/AuthProvider";
import { useDispatch } from "react-redux";
import { autoLoginUser, logout } from "../../store/slices/AuthSlice";

const UserProfile = ({ navigation }) => {
  const { height, width } = useWindowDimensions();
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState("Frienzy Nickname");
  const [isChange, setIsChange] = useState(false);
  const scrollRef = React.useRef();
  const isAndroid = Platform.OS === "android";
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(navigation);
  }, [navigation]);

  const onLogout = async () => {
    await AuthProvider.logoutUser();
    dispatch(logout());
    // AuthProvider.logoutUser();

    // navigation.push('RootNavigator');
  };
  return (
    <LinearGradient colors={Colors.backgroundGradient} style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        ref={scrollRef}
        contentContainerStyle={{ minHeight: isChange ? "50%" : "100%" }}
        extraScrollHeight={isAndroid ? 0 : 75}
        onKeyboardDidShow={() => {
          isAndroid && scrollRef.current.scrollForExtraHeightOnAndroid(25);
        }}
        onKeyboardWillHide={() => !isAndroid && setIsChange(false)}
        onKeyboardDidHide={() => isAndroid && setIsChange(false)}
      >
        <View
          style={{
            ...AppStyles.loginContainer,
            paddingTop: height * 0.08,
          }}
        >
          {/* HEADER */}
          <Header navigation={navigation} title={'Profile'}/>
          <View style={{ alignItems: "center", width: "100%" }}>
            {/* AVATAR  */}
            <Avatar name={name} />
            {/* NAME */}
            {!isChange ? (
              <View>
                <Text
                  style={{
                    color: "#EEF0FF",
                    fontSize: normalize(22),
                    lineHeight: normalize(27),
                    fontFamily: "Poppins-SemiBold",
                    marginTop: normalize(25),
                    alignSelf: "center",
                  }}
                >
                  {name}
                </Text>
                <Text
                  style={{
                    color: "#9496A2",
                    fontSize: normalize(17),
                    lineHeight: normalize(20.62),
                    fontFamily: "Poppins-Medium",
                    marginTop: normalize(5),
                    alignSelf: "center",
                  }}
                >
                  {user.phone ?? "+1 123 456 7890"}
                </Text>
              </View>
            ) : (
              <TextInput
                returnKeyType="done"
                autoFocus={true}
                textAlign="center"
                value={name}
                onChangeText={(text) => setName(text)}
                style={{
                  ...AppStyles.textInput,
                  width: "100%",
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: Colors.darkText,
                  borderRadius: 10,
                  marginBottom: normalize(0),
                  marginTop: normalize(25),
                  paddingVertical: normalize(12.81),
                  fontSize: Platform.select({
                    ios: normalize(18),
                    android: normalize(21),
                  }),
                  lineHeight: Platform.select({
                    ios: normalize(24),
                    android: normalize(27),
                  }),
                }}
                placeholderTextColor={Colors.darkText}
              />
            )}
            {/* PHONE */}
          </View>
          <View style={{ width: "100%", marginTop: normalize(60) }}>
            {/* SHOW LOCATION */}
            <ProfileRow title={"Show location"} toggle />
            {/* PROFILE ROW */}
            <ProfileRow
              title={"Change nickname"}
              onPress={() => setIsChange(!isChange)}
            />
            <ProfileRow title={"Log out"} onPress={() => onLogout()} />
            <ProfileRow title={"Delete account"} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default UserProfile;
