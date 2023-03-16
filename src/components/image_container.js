import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Image,
  Alert,
  StyleSheet,
  Linking,
  Platform,
  Text,
  Dimensions,
} from "react-native";
import {
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { DownloadButton } from "./download_button";
import { Colors, Sizes } from "../utils/AppConstants";
import { Strings } from "../utils/Localizations";
import { launchImageLibrary } from "react-native-image-picker";
import { useDispatch } from "react-redux";
// import { activateBox, deactivateBox } from "../store/slices/AddToShowcaseSlice";
import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import Carousel, { Pagination } from "react-native-new-snap-carousel";
import Toast from "react-native-toast-message";
import { useRef } from "react";
import Localization from "../services/LocalizationService";


export const ImageContainer = ({
  style,
  title,
  imageContainerStyle,
  imageStyle,
  icon,
  multi = false,
  disabled = false,
  onImageChange,
  initialImage,
}) => {
  const options = {
    mediaType: "photo",
    includeBase64: false,
    includeExtra: true,
    selectionLimit: multi ? 3 : 1,
  };
  const [response, setResponse] = useState(null);
  const dispatch = useDispatch();
  const [dataImage, setDataImage] = useState([]);

  const isCarousel = useRef(null);
  const [index, setIndex] = useState(0);

  const ITEM_WIDTH = Platform.isPad ? 343 : WINDOW_WIDTH - 32;

  const renderItem = ({ index }) => {
    return (
      <View style={[styles.image, { alignItems: "center" }]}>
        <Image
          resizeMode="cover"
          resizeMethod="scale"
          style={[styles.image]}
          source={{ uri: dataImage[index] }}
        />
      </View>
    );
  };

  // useEffect(
  //   useCallback(() => {
  //     response !== null ? dispatch(activateBox()) : dispatch(deactivateBox());
  //   }, [response])
  // );

  useEffect(() => {
    if (disabled) {
      setResponse(null);
    }
  }, [disabled]);

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
            if (!response?.assets) {
              setResponse(res);
              let data = res.assets?.map((el) => el.uri + "");
              setDataImage(data);
            } else {
              const newAssets = [...response.assets, ...res.assets].slice(0, 3);

              const newResponse = { assets: newAssets };
              setResponse(newResponse);

              const newData = newAssets.map((el) => el.uri);
              setDataImage(newData);
            }
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
    <View style={style}>
      {title && (
        <Text
          style={{
            fontFamily: Platform.select({
              ios: "Roboto",
              android: "Roboto-Medium",
            }),
            fontWeight: Platform.select({ ios: "500" }),
            fontSize: 18,
            color: Colors.grayscale[900],
            marginBottom: 12,
          }}
        >
          {title}
        </Text>
      )}

      <TouchableHighlight
        onPress={
          !disabled && !response?.assets ? () => onButtonPress(options) : null
        }
        underlayColor={Colors.primary[200]}
        style={[
          styles.imageContainer,
          imageContainerStyle,
          response?.assets && styles.imageContainer,
        ]}
      >
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {response?.assets && (
            <Carousel
              layout="stack"
              scrollEnabled={true}
              hasParallaxImages={false}
              inactiveSlideOpacity={0}
              inactiveSlideScale={0}
              inactiveSlideShift={0}
              ref={isCarousel}
              data={dataImage}
              renderItem={(index) => renderItem(index)}
              sliderWidth={ITEM_WIDTH}
              itemWidth={ITEM_WIDTH}
              onSnapToItem={(index) => setIndex(index)}
            />
          )}
          <View
            style={{
              position: "absolute",
              bottom: -10,
              flexDirection: "row",
              alignSelf: "center",
            }}
          >
            <Pagination
              dotsLength={dataImage ? dataImage?.length : 0}
              activeDotIndex={index}
              inactiveDotStyle={{
                width: 8,
                height: 8,
                borderRadius: 10,
                marginHorizontal: -4,
                backgroundColor: Colors.primary[200],
              }}
              inactiveDotScale={1}
              inactiveDotOpacity={1}
              carouselRef={isCarousel}
              dotStyle={{
                width: 8,
                height: 8,
                borderRadius: 10,
                marginHorizontal: -4,
                backgroundColor: Colors.primary[900],
              }}
            />
          </View>
          {!response?.assets && <DownloadButton icon={icon} disabled={false} />}
        </View>
      </TouchableHighlight>

      {response?.assets && (
        <View style={{ marginTop: 16, alignItems: "center" }}>
          <DownloadButton
            icon={icon}
            onPress={() => onButtonPress(options)}
            disabled={dataImage?.length === 3}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: Platform.isPad ? 343 : WINDOW_WIDTH - 32,
    minHeight: Platform.isPad ? 343 : WINDOW_WIDTH - 32,
    maxHeight: Platform.isPad ? 343 : WINDOW_WIDTH - 32,
    borderWidth: 1,
    borderRadius: Sizes.medium,
    borderColor: Colors.grayscale[200],
  },
  image: {
    borderRadius: Sizes.medium,
    width: Platform.isPad ? 343 : WINDOW_WIDTH - 32,
    height: Platform.isPad ? 343 : WINDOW_WIDTH - 32,
  },
});
