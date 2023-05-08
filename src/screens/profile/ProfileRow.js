import React, { memo } from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { AssetImage } from "../../assets/asset_image";
import Assets from "../../assets";
import normalize from "react-native-normalize";
import { AppStyles } from "../../utils/AppStyles";

export const ProfileRow = memo(
  ({ title, toggle, defaultToggle, toggleOn, onToggle, onPress, qrCode }) => {
    return (
      <TouchableOpacity onPress={onPress} style={AppStyles.profileRowContainer} disabled={toggle}>
        <Text style={AppStyles.medium17}>{title}</Text>
        {!toggle && (
          <View style={AppStyles.profileRowIcon}>
            {!qrCode ? (
              <AssetImage
                asset={Assets.arrowBack}
                width={normalize(7)}
                height={normalize(12)}
                containerStyle={{
                  transform: [{ rotate: "180deg" }],
                }}
              />
            ) : (
              <AssetImage
                asset={Assets.qrCode}
                width={normalize(20.62)}
                height={normalize(20.62)}
              />
            )}
          </View>
        )}
        {toggle && (
          <Switch
            trackColor={{false: "#313132", true: "#313132"}}
            thumbColor={toggleOn ? '#FF956D' : '#f4f3f4'}
            onValueChange={() => onToggle(!toggleOn)}
            value={toggleOn}
          />
        )}
      </TouchableOpacity>
    );
  }
);
