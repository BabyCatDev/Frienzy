import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Colors } from "../../utils/Colors";
import { AppStyles } from "../../utils/AppStyles";
import normalize from "react-native-normalize";
import LinearGradient from "react-native-linear-gradient";
import Ionicon from "react-native-vector-icons/Ionicons";

const FriendListItem = ({ item, onPressHandler, index, selected, showChecks=false }) => {
  const getInitials = (name) => {
    const fullName = name;
    return fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <Pressable
      onPress={() => {
        onPressHandler({ itemClicked: item });
      }}
      style={{
        ...AppStyles.contactItem,
        marginTop: !index ? normalize(6.56) : 0,
        borderTopWidth: index ? 1.5 : 0,
        borderTopColor: index ? Colors.gray : "transparent",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={AppStyles.contactImageContainer}>
          {item.profilePic ? (
            <Image
              resizeMode="cover"
              source={{ uri: item.profilePic }}
              style={AppStyles.contactImage}
            />
          ) : (
            <Text style={AppStyles.semibold25}>
              {getInitials(item.name).substr(0, 2)}
            </Text>
          )}
        </View>
        <View style={{flex: 1}}>
          <Text style={{ ...AppStyles.semibold17, maxWidth: 300 }}>
            {item.name}
          </Text>
          <Text style={AppStyles.medium13}>{item.phone}</Text>
        </View>
        {showChecks ? selected ? (
          <LinearGradient
            colors={Colors.mainGradient}
            useAngle={true}
            angle={132.35}
            style={AppStyles.checkBoxContainer}
          >
            <Ionicon name={"checkmark-sharp"} size={normalize(13)} color={"white"} />
          </LinearGradient>
        ) : (
          <View
            style={{
              ...AppStyles.checkBoxContainer,
              backgroundColor: Colors.gray,
            }}
          />
        ) : null}
      </View>
    </Pressable>
  );
};
export default FriendListItem;
