import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Colors } from "../../utils/Colors";
import { AppStyles } from "../../utils/AppStyles";
import Assets from "../../assets";
import { AssetImage } from "../../assets/asset_image";
import normalize from "react-native-normalize";
import LinearGradient from "react-native-linear-gradient";

const ContactItem = ({ item, onPress, index }) => {
  const [check, setCheck] = useState(false);
  const getMobileNumber = (item) => {
    if (item?.phoneNumbers.length == 1) {
      return item?.phoneNumbers[0]?.number;
    } else {
      const mobile = item?.phoneNumbers.find((b) => b.label === "mobile");
      return mobile?.number ?? item?.phoneNumbers[0]?.number;
    }
  };
  return (
    <View
      style={{
        flexDirection: "row",
        // backgroundColor: "green",
        paddingVertical: normalize(18.44),
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: !index ? normalize(6.56): 0,
        borderTopWidth: index? 1.5: 0,
        borderTopColor: index? "#2C2937": "transparent",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: normalize(60),
            height: normalize(60),
            backgroundColor: !item.hasThumbnail? "#9496A2": null,
            borderRadius: normalize(30),
            marginRight: normalize(18.44),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {item?.hasThumbnail ? (
            <Image
              resizeMode="cover"
              source={{ uri: item?.thumbnailPath }}
              style={{
                width: normalize(60),
                height: normalize(60),
                borderRadius: normalize(30),
              }}
            />
          ) : (
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: normalize(25),
                lineHeight: normalize(30),
                fontFamily: "Poppins-SemiBold",
              }}
            >
              {item.givenName[0] + item.familyName[0]}
            </Text>
          )}
        </View>
        <View>
          <Text
            style={{
              color: "#EEF0FF",
              fontSize: normalize(17.52),
              lineHeight: normalize(21.46),
              fontFamily: "Poppins-SemiBold",
              marginBottom: normalize(5),
            }}
          >
            {item?.givenName + " " + item?.familyName}
          </Text>
          <Text
            style={{
              color: "#9496A2",
              fontSize: normalize(13.83),
              lineHeight: normalize(16.78),
              fontFamily: "Poppins-Medium",
            }}
          >
            {getMobileNumber(item)}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => {
          setCheck(!check);
        }}
      >
        {check ? (
          <LinearGradient
            colors={Colors.mainGradient}
            useAngle={true}
            angle={132.35}
            style={{
              width: normalize(20),
              height: normalize(20),
              borderRadius: normalize(10),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
          <AssetImage 
            asset={Assets.checkSign}
            width={normalize(13)}
            height={normalize(12)}
          />
          </LinearGradient>
        ) : (
          <View
            style={{
              width: normalize(20),
              height: normalize(20),
              borderRadius: normalize(10),
              backgroundColor: "#2C2937",
            }}
          />
        )}
      </Pressable>
    </View>
  );
};
export default ContactItem;
