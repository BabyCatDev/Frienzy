import React, { memo } from "react";
import { View, Text, Pressable } from "react-native";
import { AssetImage } from "../../assets/asset_image";
import Assets from "../../assets";
import normalize from "react-native-normalize";
import { MemoToggle } from "../../components/toggle";
import { Colors } from "../../utils/Colors";
import { AppStyles } from "../../utils/AppStyles";

export const ProfileRow = memo(
  ({ navigation, title, toggle, toggleOn, onToggle, onPress }) => {
    return (
      <Pressable onPress={onPress} style={AppStyles.profileRowContainer}>
        <Text style={AppStyles.medium17}>{title}</Text>
        {!toggle && (
          <View style={AppStyles.profileRowIcon}>
            <AssetImage
              asset={Assets.arrowBack}
              width={normalize(7)}
              height={normalize(12)}
              containerStyle={{
                transform: [{ rotate: "180deg" }],
              }}
            />
          </View>
        )}
        {toggle && (
          <Pressable
            onPress={() => onToggle(!toggleOn)}
            style={AppStyles.toggleContainer}
          >
            <MemoToggle
              onToggle={() => onToggle(!toggleOn)}
              isOn={toggleOn}
              onColor={Colors.darkGray}
              offColor={Colors.gray}
              style={{
                width: normalize(42),
                height: normalize(20.62),
              }}
            />
          </Pressable>
        )}
      </Pressable>
    );
  }
);
