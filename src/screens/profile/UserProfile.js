import React, { useState } from "react";
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

const UserProfile = ({ navigation }) => {
  const { height, width } = useWindowDimensions();
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState("Frienzy Nickname");
  const [isChange, setIsChange] = useState(false);

  return (
    <LinearGradient colors={Colors.backgroundGradient} style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        extraScrollHeight={75}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === "ios"}
        onKeyboardWillHide={() => setIsChange(false)}
      >
        <View
          style={{
            ...AppStyles.loginContainer,
            justifyContent: "flex-start",
            paddingTop: height * 0.07,
            // paddingBottom: height * 0.3,
          }}
        >
          {/* HEADER */}
          <Header />
          <View style={{ alignItems: "center", width: '100%' }}>
            {/* AVATAR  */}
            <Avatar name={name}/>
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
                  {user.phone}
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
                  marginBottom: normalize(0),
                  marginTop: normalize(25),
                  paddingVertical: normalize(12.81),
                  fontSize: normalize(18),
                  lineHeight: normalize(24),
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
            <ProfileRow title={"Log out"} onPress={()=> navigation.navigate('UserLogin')}/>
            <ProfileRow title={"Delete account"} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default UserProfile;
