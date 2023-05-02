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

export const Avatar = ({ username, profilePic }) => {
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
              await FBSaver.getInstance().saveProfilePic(data?.[0], Platform.OS);
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
    <View style={{ marginTop: normalize(44) }}>
      <View style={AppStyles.avatarContainer}>
        {dataImage?.[0] || profilePic ? (
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={AppStyles.avatar}
            source={{ uri: dataImage?.[0] ?? profilePic.replace('.googleapis.com:443/', '.googleapis.com/') }}
          />
        ) : (
          <Text
            style={{
              ...AppStyles.medium70,
              textAlign: "center",
            }}
          >
            {getInitials(username)}
          </Text>
        )}
      </View>
      <Pressable onPress={() => onButtonPress(options)}>
        <AssetImage
          asset={Assets.pencilButton}
          width={normalize(49)}
          height={normalize(48)}
          containerStyle={AppStyles.editImage}
        />
      </Pressable>
    </View>
  );
};
