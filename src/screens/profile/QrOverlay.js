import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from "react-native";
import { BlurView } from "@react-native-community/blur";
import LinearGradient from "react-native-linear-gradient";
import normalize from "react-native-normalize";
import { AssetImage } from "../../assets/asset_image";
import Assets from "../../assets";

const QrOverlay = ({ setVisible, phoneNumber, firstName, lastName }) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 22,
      }}
    >
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <BlurView
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
          blurType="dark"
          blurAmount={Platform.OS === "ios" ? 2 : 11}
        />
      </TouchableWithoutFeedback>
      <LinearGradient
        style={{
          width: "100%",
          borderRadius: 20,
          paddingVertical: normalize(49),
          paddingHorizontal: normalize(38),
          alignItems: "center",
        }}
        colors={["#1A1822", "#12101A"]}
      >
        <Text
          style={{
            fontFamily: "Poppins-SemiBold",
            color: "#EEF0FF",
            fontSize: normalize(22),
            lineHeight: normalize(33),
          }}
        >
          SCAN QR CODE
        </Text>
        <View
          style={{
            width: "100%",
            height: width - 44 - 76,
            borderRadius: 20,
            marginTop: 20,
            padding: 33,
          }}
        >
          <Image
            source={{
              uri: `https://qrcode.tec-it.com/API/QRCode?data=BEGIN%3aVCARD%0d%0aVERSION%3a3.0%0d%0aFN%3bCHARSET%3dUTF-8%3a${firstName}+${lastName}%0d%0aN%3bCHARSET%3dUTF-8%3a${lastName}%3b${firstName}%3b%3b%3b%0d%0aTEL%3bTYPE%3dHOME%2cVOICE%3a${phoneNumber}%0d%0aEMAIL%3aemail%40example.com%0d%0aEND%3aVCARD&istransparent=true&color=%23EEF0FF`,
            }}
            style={{ width: "100%", height: "100%", borderRadius: 5 }}
          />
          <AssetImage
            asset={Assets.roundCorner}
            width={normalize(28)}
            height={normalize(28)}
            containerStyle={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          />
          <AssetImage
            asset={Assets.roundCorner}
            width={normalize(28)}
            height={normalize(28)}
            containerStyle={{
              position: "absolute",
              bottom: 0,
              right: 0,
              transform: [{ rotate: "90deg" }],
            }}
          />
          <AssetImage
            asset={Assets.roundCorner}
            width={normalize(28)}
            height={normalize(28)}
            containerStyle={{
              position: "absolute",
              bottom: 0,
              left: 0,
              transform: [{ rotate: "180deg" }],
            }}
          />
          <AssetImage
            asset={Assets.roundCorner}
            width={normalize(28)}
            height={normalize(28)}
            containerStyle={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: [{ rotate: "270deg" }],
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => setVisible(false)}
          style={{
            position: "absolute",
            top: normalize(13),
            right: normalize(13),
          }}
        >
          <AssetImage
            asset={Assets.xClose}
            width={normalize(20)}
            height={normalize(20)}
          />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default QrOverlay;
