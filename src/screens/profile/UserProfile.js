import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Platform,
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
import { logout } from "../../store/slices/AuthSlice";
import { MainButton } from "../../components/main_button";
import FGLocationRetriever from "../../services/FGLocationRetriever";
import QrOverlay from "./QrOverlay";
import FBSaver from "../../services/FBSaver";
import { removeValue } from "../../utils/AsyncStore";
import DeleteAccountOverlay from "./DeleteAccountOverlay";

const UserProfile = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isChange, setIsChange] = useState(false);
  const [visible, setVisible] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const scrollRef = React.useRef();
  const isAndroid = Platform.OS === "android";
  const { isFirstLaunch } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const firstName = useMemo(() => {
    const nameArr = name?.username?.split(" ");
    if (nameArr?.length > 1) {
      return nameArr[0];
    } else {
      return name?.username;
    }
  });

  const lastName = useMemo(() => {
    const nameArr = name?.username?.split(" ");
    if (nameArr?.length > 1) {
      return nameArr[1];
    } else {
      return "";
    }
  });

  const [locationSharing, setLocationSharing] = useState(
    FGLocationRetriever.getInstance().locationTrackingOn
  );

  useEffect(() => {
    if (locationSharing) {
      FGLocationRetriever.getInstance().startLocationTracking();
    } else {
      FGLocationRetriever.getInstance().stopLocationTracking();
    }
  }, [locationSharing]);

  const onLogout = async () => {
    try {
      await AuthProvider.logoutUser();
      FGLocationRetriever.getInstance().reset();
      dispatch(logout());
    } catch (e) {
      console.log(e);
    }
  };

  const onDeleteAccount = async () => {
    try {
      await AuthProvider.logoutUser();
      FGLocationRetriever.getInstance().reset();
      await FBSaver.getInstance().reset();
      await removeValue("image");
      await removeValue("alarm");
      await removeValue("contacts");
      await removeValue("counter");
      await removeValue("selectedContactList");
      await removeValue("phoneNumber");
      dispatch(logout());
    } catch (e) {
      console.log(e);
    }
  };
  async function fetchData() {
    const key = FBSaver.getInstance().userKey;
    const phone = FBSaver.getInstance().keyToPhone[key];
    const user = await FBSaver.getInstance().getUserData();
    setName(user ? user : { username: "Frienzy Nickname", profile_pic: "" });
    setPhone(phone ? phone : "+12345678901");
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
            <Avatar username={name?.username} profilePic={name?.profile_pic} />
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
                  {name?.username}
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
                value={name?.username}
                onChangeText={(text) => setName({ ...name, username: text })}
                style={AppStyles.profileInput}
                placeholderTextColor={Colors.darkText}
                onBlur={async () => {
                  await FBSaver.getInstance().saveUsername(name?.username);
                }}
              />
            )}
            {/* PHONE */}
          </View>
          <View style={{ width: "100%", marginTop: normalize(60) }}>
            {/* SHOW LOCATION */}
            <ProfileRow
              title={"Show location"}
              toggle
              toggleOn={locationSharing}
              onToggle={setLocationSharing}
            />
            {/* PROFILE ROW */}
            <ProfileRow
              title={"Change nickname"}
              onPress={() => setIsChange(!isChange)}
            />
            <ProfileRow
              title={"My QR code"}
              onPress={() => setVisible(true)}
              qrCode
            />
            <ProfileRow title={"Log out"} onPress={async() => await onLogout()} />
            <ProfileRow
              title={"Delete account"}
              onPress={() => setConfirm(true)}
            />
          </View>
        </View>
        {isFirstLaunch && (
        <MainButton
          title={"CONTINUE"}
          containerStyle={{
            // position: "absolute",
            paddingBottom: height * 0.06,
            alignSelf: "center",
          }}
          onPress={async () => {
            await FBSaver.getInstance().saveUsername(
              name?.username,
              isFirstLaunch
            );
            navigation.push("ContactsStack");
          }}
        />
      )}
      </KeyboardAwareScrollView>
      {visible && (
        <QrOverlay
          setVisible={setVisible}
          phoneNumber={phone}
          firstName={firstName}
          lastName={lastName}
        />
      )}
      {confirm && (
        <DeleteAccountOverlay setVisible={setConfirm} onDeleteAccount={onDeleteAccount} />
      )}
    </LinearGradient>
  );
};

export default UserProfile;
