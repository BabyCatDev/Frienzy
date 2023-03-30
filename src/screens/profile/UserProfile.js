import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Platform,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { logout } from "../../store/slices/AuthSlice";
import { MainButton } from "../../components/main_button";
import FGLocationTrackingService from "../../services/FGLocationTrackingService";
import FGLocationRetriever from "../../services/FGLocationRetriever";

const UserProfile = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+1 123 456 7890");
  const [isChange, setIsChange] = useState(false);
  const scrollRef = React.useRef();
  const isAndroid = Platform.OS === "android";
  const { isFirstLaunch } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [locationSharing, setLocationSharing] = useState(FGLocationRetriever.getInstance().locationTrackingOn);

  useEffect(() => {
    if (locationSharing) {
      FGLocationRetriever.getInstance().startLocationTracking();
    } else {
      FGLocationRetriever.getInstance().stopLocationTracking();
    }
  }, [locationSharing]);

  const onLogout = async () => {
    await AuthProvider.logoutUser();
    FGLocationRetriever.getInstance().reset();
    dispatch(logout());
  };

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log(value, "fffff");
        return value;
      } else if (key === "phoneNumber") {
        return "+1 123 456 7890";
      } else {
        return "Frienzy Nickname";
      }
    } catch (e) {
      console.log(e);
    }
  };

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("nickname", value);
      console.log("success");
    } catch (e) {
      console.log(e);
    }
  };
  async function fetchData() {
    const phone = await getData("phoneNumber");
    const name = await getData("nickname");
    setName(name);
    setPhone(phone);
  }
  useEffect(() => {
    fetchData();
  }, []);

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
            ...AppStyles.screenContainer,
            paddingTop: height * 0.08,
          }}
        >
          {/* HEADER */}
          <Header
            navigation={navigation}
            title={"Profile"}
            noBackButton={isFirstLaunch ? true : false}
          />
          <View style={{ alignItems: "center", width: "100%" }}>
            {/* AVATAR  */}
            <Avatar name={name} />
            {/* NAME */}
            {!isChange ? (
              <View>
                <Text
                  style={{
                    ...AppStyles.semibold22,
                    marginTop: normalize(25),
                    alignSelf: "center",
                  }}
                >
                  {name}
                </Text>
                <Text
                  style={{
                    ...AppStyles.medium17,
                    marginTop: normalize(5),
                    alignSelf: "center",
                  }}
                >
                  {phone}
                </Text>
              </View>
            ) : (
              <TextInput
                returnKeyType="done"
                autoFocus={true}
                textAlign="center"
                value={name}
                onChangeText={(text) => setName(text)}
                style={AppStyles.profileInput}
                placeholderTextColor={Colors.darkText}
                onBlur={async () => {
                  await storeData(name);
                }}
              />
            )}
            {/* PHONE */}
          </View>
          <View style={{ width: "100%", marginTop: normalize(60) }}>
            {/* SHOW LOCATION */}
            <ProfileRow title={"Show location"} toggle toggleOn={locationSharing} onToggle={setLocationSharing}/>
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
      {isFirstLaunch && (
        <MainButton
          title={"CONTINUE"}
          containerStyle={{
            position: "absolute",
            bottom: height * 0.06,
            alignSelf: "center",
          }}
          onPress={() => {
            navigation.push("ContactsStack");
          }}
        />
      )}
    </LinearGradient>
  );
};

export default UserProfile;
