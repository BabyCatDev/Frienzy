import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "@react-native-community/blur";
import LinearGradient from "react-native-linear-gradient";
import { AppStyles } from "../../utils/AppStyles";
import normalize from "react-native-normalize";
import { AssetImage } from "../../assets/asset_image";
import Assets from "../../assets";

const DeleteAccountOverlay = ({ setVisible, onDeleteAccount }) => {
  const [isLoading, setIsLoading] = useState(false);

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
            textAlign: "center",
            paddingBottom: normalize(40),
          }}
        >
          {"Are you sure you want to delete account?\nAll data will be lost"}
        </Text>
        <View
          style={{
            // backgroundColor: "red",
            // width: "100%",
            // height: width - 44 - 76,
            // borderRadius: 20,
            // marginTop: 20,
            // padding: 33,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              setIsLoading(true);
              await onDeleteAccount();
              setIsLoading(false);
            }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginRight: normalize(10),
              borderRadius: 10,
            }}
          >
            <LinearGradient
              colors={["#4CBD49", "#2D4152"]}
              style={{ width: "100%", borderRadius: 10 }}
              useAngle={true}
              angle={137}
            >
              <Text
                style={{
                  ...AppStyles.semibold17,
                  lineHeight: normalize(26),
                  textAlign: "center",
                }}
              >
                Yes
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setVisible(false)}
            style={{
              // backgroundColor: "red",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: normalize(10),
              borderRadius: 10,
            }}
          >
            <LinearGradient
              colors={["#FF6D6D", "#EB1D1D"]}
              style={{ width: "100%", borderRadius: 10 }}
              useAngle={true}
              angle={137}
            >
              <Text
                style={{
                  ...AppStyles.semibold17,
                  lineHeight: normalize(26),
                  textAlign: "center",
                }}
              >
                No
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
            // containerStyle={{
            //   position: "absolute",
            //   top: normalize(13),
            //   right: normalize(13),
            // }}
          />
        </TouchableOpacity>
        {isLoading && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,.7)",
            }}
          >
            <ActivityIndicator animating={isLoading} size="large" />
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

export default DeleteAccountOverlay;
