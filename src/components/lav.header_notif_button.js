import React from "react";
import {AssetImage} from "../assets/asset_image";
import {Colors} from "../utils/AppConstants";
import {TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import Assets from "../assets";

const HeaderNotifButton = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <AssetImage
        asset={true ? Assets.bell : Assets.bellNew}
        height={24}
        stroke={Colors.grayscale[900]}
        containerStyle={{padding: 10}}
      />
    </TouchableOpacity>
  );
};

connect()(HeaderNotifButton);

export default HeaderNotifButton;
