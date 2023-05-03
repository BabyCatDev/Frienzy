import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Colors } from "../../utils/Colors";
import { AppStyles } from "../../utils/AppStyles";
import normalize from "react-native-normalize";

const FriendListItem = ({ item, onPress, index }) => {
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
        onPress({ itemClicked: item });
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
        <View>
          <Text style={{ ...AppStyles.semibold17, maxWidth: 300 }}>
            {item.name}
          </Text>
          <Text style={AppStyles.medium13}>{item.phone}</Text>
        </View>
      </View>
    </Pressable>
  );
};
export default FriendListItem;
