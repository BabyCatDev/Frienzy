import React, { useCallback, useState } from "react";
import { View, Image, Pressable, Alert, Linking, Text } from "react-native";
import { AssetImage } from "../../assets/asset_image";
import Assets from "../../assets";
import normalize from "react-native-normalize";
import { launchImageLibrary } from "react-native-image-picker";
import Localization from "../../services/LocalizationService";
import Toast from "react-native-toast-message";
import { Sizes } from "../../utils/AppConstants";
import { AppStyles } from "../../utils/AppStyles";

export const Avatar = ({ name }) => {
  const [response, setResponse] = useState(null);
  const [dataImage, setDataImage] = useState([]);
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("");
  const options = {
    mediaType: "photo",
    includeBase64: false,
    includeExtra: true,
    selectionLimit: 1,
  };
  const onButtonPress = useCallback(
    (options) => {
      if (response?.errorCode !== "permission") {
        launchImageLibrary(options, (res) => {
          if (res.didCancel) {
            console.log("User cancelled the process");
          } else if (res.errorCode === "permission") {
            Alert.alert(
              Localization.getString("common", "alertHeader"),
              Localization.getString("common", "alertMessage"),
              [
                {
                  text: Localization.getString("common", "toSettings"),
                  onPress: () => {
                    Linking.openSettings();
                  },
                },
                {
                  text: Localization.getString("common", "cancel"),
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
                title: Localization.getString("common", "toastDeniedPhoto"),
              },
            });
          } else {
            // console.log(res)
            setResponse(res);
            let data = res.assets?.map((el) => el.uri + "");
            setDataImage(data);
          }
        });
      } else {
        Alert.alert(
          Localization.getString("common", "alertHeader"),
          Localization.getString("common", "alertMessage"),
          [
            {
              text: Localization.getString("common", "toSettings"),
              onPress: () => {
                Linking.openSettings();
              },
            },
            {
              text: Localization.getString("common", "cancel"),
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
        {response ? (
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={AppStyles.avatar}
            source={{ uri: dataImage[0] }}
          />
        ) : (
          <Text
            style={{
              ...AppStyles.medium70,
              textAlign: "center",
            }}
          >
            {initials}
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
