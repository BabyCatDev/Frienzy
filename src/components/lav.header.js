import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Assets from "../assets";
import { AssetImage } from "../assets/asset_image";
import { Colors, ScreenNames, Sizes } from "../utils/AppConstants";
import HeaderNotifButton from "./lav.header_notif_button";
import { logout } from "../store/slices/AuthSlice";
export const HeaderLeft = (props) => {
  return (
    <TouchableOpacity
      {...props}
      style={{
        width: 44,
        height: 44,
        marginLeft: 16,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AssetImage
        asset={Assets.leftBig}
        height={24}
        stroke={Colors.grayscale[900]}
      />
    </TouchableOpacity>
  );
};

export const HeaderCheckButton = (props) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          width: 44,
          height: 44,
          marginRight: 16,
          justifyContent: "center",
          alignItems: "center",
        },
        props.style,
      ]}
    >
      <AssetImage
        {...props}
        asset={Assets.check}
        height={24}
        stroke={props.stroke ? props.stroke : Colors.grayscale[900]}
      />
    </TouchableOpacity>
  );
};

export const HeaderSignOutButton = (props) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          width: 44,
          height: 44,
          marginRight: 16,
          justifyContent: "center",
          alignItems: "center",
        },
        props.style,
      ]}
    >
      <AssetImage
        {...props}
        asset={Assets.signOut}
        height={24}
        stroke={props.stroke ? props.stroke : Colors.grayscale[900]}
      />
    </TouchableOpacity>
  );
};

export const HeaderNextButton = (props) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          width: 44,
          height: 44,
          marginRight: 16,
          justifyContent: "center",
          alignItems: "center",
        },
        props.style,
      ]}
    >
      <AssetImage
        {...props}
        asset={Assets.chevronRight}
        height={24}
        stroke={props.stroke ? props.stroke : Colors.grayscale[900]}
      />
    </TouchableOpacity>
  );
};

export const HeaderStoreButton = (props) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: Colors.grayscale[100],
        marginLeft: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
      }}
    >
      <AssetImage
        asset={Assets.store}
        height={24}
        stroke={Colors.grayscale[200]}
        containerStyle={{ padding: 10 }}
      />
    </TouchableOpacity>
  );
};


export const HeaderRight = (props) => {
  const navigation = useNavigation();
  
  return (
    <View style={{ marginRight: 16, flexDirection: "row" }}>
      <HeaderNotifButton
        onPress={() => navigation.navigate(ScreenNames.MainStack.NOTIFICATIONS)}
      />
    </View>
  );
};

export const HeaderTitle = (props) => {
  return (
    <View>
      <Text
        style={{
          fontSize: Sizes.fonts.h3,
          fontFamily: Platform.select({
            ios: "Roboto",
            android: "Roboto-Medium",
          }),
          fontWeight: Platform.select({ ios: "500" }),
          color: Colors.grayscale[900],
        }}
      >
        {props.children}
      </Text>
    </View>
  );
};
export const EmptyHeaderTitle = () => <></>;

export const Header = ({ light }) => <View style={HeaderStyle} />;

export const HeaderStyle = {
  height: Sizes.header.height,
  backgroundColor: Colors.grayscale[0],
  shadowOpacity: 0,
};
