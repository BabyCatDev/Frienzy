import React, { useState, memo, useEffect } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Colors } from "../../utils/Colors";
import { AppStyles } from "../../utils/AppStyles";
import Assets from "../../assets";
import { AssetImage } from "../../assets/asset_image";
import normalize from "react-native-normalize";
import LinearGradient from "react-native-linear-gradient";
import { addShareLocation } from "../../store/slices/ShareLocationSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import FGLocationRetriever from "../../services/FGLocationRetriever";

const ContactItem = ({ item, onPress, index, check }) => {
  // const { shareLocation } = useSelector((state) => state.shareLocation);
  // const dispatch = useDispatch();
  const getMobileNumber = (item) => {
    if (item?.phoneNumbers.length == 1) {
      return item?.phoneNumbers[0]?.number;
    } else {
      const mobile = item?.phoneNumbers.find((b) => b.label === "mobile");
      return mobile?.number ?? item?.phoneNumbers[0]?.number;
    }
  };

  return (
    <Pressable
      onPress={async () => {
        onPress({item: item, state: !check});
        if (!check) {
          FGLocationRetriever.getInstance().addPhoneToTrack(
            getMobileNumber(item)
          );
          FGLocationRetriever.getInstance().allowPhoneToTrackMe(
            getMobileNumber(item)
          );
        } else {
          FGLocationRetriever.getInstance().removePhoneToTrack(
            getMobileNumber(item)
          );
          FGLocationRetriever.getInstance().disallowPhoneToTrackMe(
            getMobileNumber(item)
          );
        }
      }}
      style={{
        ...AppStyles.contactItem,
        marginTop: !index ? normalize(6.56) : 0,
        borderTopWidth: index ? 1.5 : 0,
        borderTopColor: index ? Colors.gray : "transparent",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={AppStyles.contactImageContainer}>
          {item?.hasThumbnail ? (
            <Image
              resizeMode="cover"
              source={{ uri: item?.thumbnailPath }}
              style={AppStyles.contactImage}
            />
          ) : (
            <Text style={AppStyles.semibold25}>
              {item.givenName[0] + item.familyName[0]}
            </Text>
          )}
        </View>
        <View>
          <Text style={{...AppStyles.semibold17, maxWidth: 300}}>
            {item?.givenName + " " + item?.familyName}
          </Text>
          <Text style={AppStyles.medium13}>{getMobileNumber(item)}</Text>
        </View>
      </View>
      {check ? (
        <LinearGradient
          colors={Colors.mainGradient}
          useAngle={true}
          angle={132.35}
          style={AppStyles.checkBoxContainer}
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
            ...AppStyles.checkBoxContainer,
            backgroundColor: Colors.gray,
          }}
        />
      )}
    </Pressable>
  );
};
export default ContactItem;
