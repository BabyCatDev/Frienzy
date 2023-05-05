import { Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

const options = {
    mediaType: "photo",
    includeBase64: false,
    includeExtra: true,
    selectionLimit: 1,
};

export const getPhoto = (response, setResponse, setImage) => {
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
            setImage(data?.[0])
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
}
