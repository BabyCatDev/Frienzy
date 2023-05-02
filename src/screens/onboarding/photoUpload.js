import React, { useCallback, useState } from "react";
import {
  View,
  Image,
  Pressable,
  Alert,
  Linking,
  StyleSheet,
  Platform,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { MainButton } from "../../components/mainButton";
import Toast from "react-native-toast-message";
import { AppStyles } from "../../utils/AppStyles";
import { storeObject } from "../../utils/AsyncStore";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../utils/Colors";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { saveNameAndPhoto } from "../../services/firebase/user";
import { useSelector } from "react-redux";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const IMAGE_SIZE = 70;
const IMAGE_GAP = 4;

const PhotoUpload = () => {
  const imageSize = useSharedValue(wp(70));
  const [response, setResponse] = useState(null);
  const [dataImage, setDataImage] = useState([]);
  const [showName, setShowName] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false)

  const userDetails = useSelector(state => state.FrienzyAuth.userDetails)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: imageSize.value,
      height: imageSize.value,
    };
  });

  const options = {
    mediaType: "photo",
    includeBase64: false,
    includeExtra: true,
    selectionLimit: 1,
  };

  const nextScreen = async () => {
    setLoading(true)
    await saveNameAndPhoto(userDetails.uid, dataImage?.[0], username)
    setLoading(false)
  }

  const goToName = () => {
    imageSize.value = withSpring(showName ? wp(70) : wp(30))
    setShowName(!showName);
  }

  const onImageButtonPressed = useCallback(
    (options) => {
      if (response?.errorCode !== "permission") {
        launchImageLibrary(options, async (res) => {
          if (res.didCancel) {
            console.log("User cancelled the process");
          } else if (res.errorCode === "permission") {
            Alert.alert(
                "Frienzy requests access to Photos",
                "Go to settings to give the app permission to access Photos",
                [
                  {
                    text: "Go to settings",
                    onPress: () => {
                      Linking.openSettings();
                    },
                  },
                  {
                    text: "Cancel",
                    onPress: () => {
                      console.log("CANCELED");
                    },
                  },
                ]
              );
          } else if (res?.assets && res?.assets[0]?.fileSize === undefined) {
            Toast.show({
              type: "denied",
              position: "top",
              props: {
                title: "Failed to upload photo",
              },
            });
          } else {
            setResponse(res);
            let data = res.assets?.map((el) => el.uri);
            storeObject("image", data).then(async() => {
              setDataImage(data);
            });
          }
        });
      } else {
        Alert.alert(
          "Frienzy requests access to Photos",
          "Go to settings to give the app permission to access Photos",
          [
            {
              text: "Go to settings",
              onPress: () => {
                Linking.openSettings();
              },
            },
            {
              text: "Cancel",
              onPress: () => {
                console.log("CANCELED");
              },
            },
          ]
        );
      }
    },
    [response]
  );

  const handlePress = () => {
    if (showName) {
      imageSize.value = withSpring(showName ? wp(70) : wp(30))
      setShowName(false)
    } else {
      onImageButtonPressed(options)
    }
  }

  return (
    <LinearGradient colors={Colors.backgroundGradient} style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
          keyboardVerticalOffset={20}
        >
          <View style={localStyles.pageContainer}>
              <View style={localStyles.headerContainer}>
                  <Text style={localStyles.titleText}>
                      Profile Setup
                  </Text>
              </View>
              <View style={localStyles.infoContainer}>
                <Animated.View style={[localStyles.avatarContainer, animatedStyles]}>
                  <Pressable onPress={() => handlePress()} style={{ width: "100%", height: "100%" }}>
                      <LinearGradient colors={Colors.mainGradient} style={localStyles.avatarOutsideRing}>
                          <View style={localStyles.innerCircleContainer}>
                              <LinearGradient colors={Colors.backgroundGradient} style={localStyles.avatarOutside}>
                                  <View style={localStyles.innerCircleSecondContainer}>
                                      <View style={localStyles.avatarImageContainer}>
                                          {(dataImage?.[0] || userDetails?.profilePic?.length > 0) && (
                                              <Image
                                                  resizeMode="cover"
                                                  resizeMethod="scale"
                                                  style={localStyles.avatarImage}
                                                  source={{ uri: (dataImage?.[0] ? dataImage?.[0] : userDetails?.profilePic?.length > 0 ? userDetails.profilePic : null) }}
                                              />
                                          )}
                                      </View>
                                  </View>
                              </LinearGradient>
                          </View>
                      </LinearGradient>
                  </Pressable>
                </Animated.View>
                <View style={localStyles.inputContainer}>
                {showName ? (
                  <View>
                    <Text style={{...localStyles.nameHelper, ...AppStyles.medium13}}>What do your friends call you?</Text>
                    <TextInput value={username} onChangeText={(e) => setUsername(e)} style={{ ...localStyles.nameInput, ...AppStyles.medium16 }} placeholder="Name" />
                  </View>
                ) : (
                  <Text style={localStyles.subtitleText}>An accurate profile image helps your friends recognize you and helps us combat bots</Text>
                )}
                </View>
              </View>
              {!showName ? (
                <MainButton
                  title={"CONTINUE"}
                  isLoading={false}
                  onPress={() => goToName()}
                  isDisabled={!(dataImage?.[0] || userDetails?.profilePic)}
                />
              ) : (
                <MainButton
                  title={"FINISH SETUP"}
                  isLoading={loading}
                  onPress={() => nextScreen()}
                  isDisabled={username?.length == 0}
                />
              )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const localStyles = StyleSheet.create({
    pageContainer: {
        alignItems: "center", 
        justifyContent: "center", 
        width: "100%", 
        height: "100%"
    },
    inputContainer: {
      width: "80%",
      marginTop: 30,
    },
    nameHelper: {
      marginBottom: 10,
    },
    nameInput: {
      paddingRight: 20,
      paddingVertical: 16,
      paddingHorizontal: 20,
      width: "100%",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.darkText,
      borderRadius: 10,
    },
    infoContainer: {
      flex: 1,
      width: wp(90),
      justifyContent: "flex-start",
      alignItems: "center",
    },
    headerContainer: {
        justifyContent: "center",
        flex: 0.4,
        width: wp(80)
    },
    titleText: {
        color: "white",
        fontSize: 35,
        fontFamily: "Poppins-Semibold",
        textAlign: "center"
    },
    subtitleText: {
        color: "gray",
        fontSize: 11,
        fontFamily: "Poppins-Regular",
        textAlign: "center",
    },
    avatarContainer: {
      justifyContent: "center",
    },
    avatarOutsideRing: {
      width: "100%",
      height: "100%",
      borderRadius: wp(IMAGE_SIZE / 2)
    },
    innerCircleContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarOutside: {
      width: "95%",
      height: "95%",
      borderRadius: wp((IMAGE_SIZE - IMAGE_GAP) / 2)
    },
    innerCircleSecondContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarImageContainer: {
        width: "95%",
        height: "95%",
        borderRadius: wp((IMAGE_SIZE - (2*IMAGE_GAP)) / 2),
        backgroundColor: Colors.darkGray,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarImage: {
        width: "100%",
        height: "100%",
        borderRadius: wp((IMAGE_SIZE - (2*IMAGE_GAP)) / 2),
    }
})

export default PhotoUpload;


