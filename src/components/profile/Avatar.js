import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Image,
  Pressable,
  Alert,
  Linking,
  Text,
  Platform,
} from "react-native";
import { AssetImage } from "../../assets/asset_image";
import Assets from "../../assets";
import normalize from "react-native-normalize";
import { launchImageLibrary } from "react-native-image-picker";
import Toast from "react-native-toast-message";
import { Sizes } from "../../utils/AppConstants";
import { AppStyles } from "../../utils/AppStyles";
import { storeObject, getObject } from "../../utils/AsyncStore";
import FBSaver from "../../services/FBSaver";

export const Avatar = ({ username, profilePic, setProfilePic, isGroup=false }) => {
  const [response, setResponse] = useState(null);
  const [dataImage, setDataImage] = useState([]);

  async function getAvatar() {
    const image = await getObject("image");
    if (image) {
      setDataImage(image);
    }
  }

  useEffect(() => {
    getAvatar();
  }, []);

  const getInitials = (name) => {
    const fullName = name;
    return fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("");
  };

  const options = {
    mediaType: "photo",
    includeBase64: false,
    includeExtra: true,
    selectionLimit: 1,
  };
  const onButtonPress = useCallback(
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
              topOffset: Sizes.header.height + 34,
              props: {
                title: "Failed to upload photo",
              },
            });
          } else {
            setResponse(res);
            let data = res.assets?.map((el) => el.uri);
            storeObject("image", data).then(async() => {
              setDataImage(data);
              setProfilePic(data?.[0])
              // await FBSaver.getInstance().saveProfilePic(data?.[0], Platform.OS);
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
  return (
    <View style={{ marginTop: isGroup ? 0 : normalize(44) }}>
      <Pressable style={isGroup ? AppStyles.groupAvatarContainer : AppStyles.avatarContainer} onPress={() => onButtonPress(options)}>
        {profilePic && profilePic.length > 0 ? (
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={isGroup ? AppStyles.groupAvatar : AppStyles.avatar}
            source={{ uri: profilePic }}
          />
        ) : username.length > 0 ? (
          <Text
            style={{
              ...AppStyles.medium70,
              textAlign: "center",
            }}
          >
            {getInitials(username)}
          </Text>
        ) : (
          <Text
            style={{
              ...AppStyles.medium13,
              textAlign: "center",
              color: "white"
            }}
          >
            {"Set Group Pic\n(Optional)"}
          </Text>
        )}
      </Pressable>
    </View>
  );
};
