import React, {Component} from "react";
import {View, Text} from "react-native";
import Assets from "../../assets";
import {AssetImage} from "../../assets/asset_image";

class NotificationsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
      refreshing: false,
      error: null,
    };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Text style={{fontFamily: "Roboto-Regular", fontSize: 41}}>
          Notifications
        </Text>
      </View>
    );
  }
}

export default NotificationsScreen;
