import React, { useState, memo, useEffect } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Colors } from "../../utils/Colors";
import { AppStyles } from "../../utils/AppStyles";
import Assets from "../../assets";
import { AssetImage } from "../../assets/asset_image";
import normalize from "react-native-normalize";
import LinearGradient from "react-native-linear-gradient";
import FGLocationRetriever from "../../services/FGLocationRetriever";
import { storeObject, getObject, getBool } from "../../utils/AsyncStore";
import { getMobileNumber } from "../../utils/helper";

const ContactItem = ({ item, onPress, index, check }) => {

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
