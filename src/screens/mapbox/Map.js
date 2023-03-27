import React from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  Text,
} from "react-native";
import Mapbox from "@rnmapbox/maps";
import { Header } from "../profile/Header";
import { AssetImage } from "../../assets/asset_image";
import Assets from "../../assets";
import normalize from "react-native-normalize";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../utils/Colors";

Mapbox.setAccessToken(
  "pk.eyJ1IjoiYmFuYXJ1bXMiLCJhIjoiY2xlc2MxdGdrMGlicjNwbjFheWd1YzNwZSJ9.fnUNAsXBtfkFa1ceAVe_Pg"
);
const Map = ({ navigation }) => {
  const { height, width } = useWindowDimensions();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LinearGradient
        style={{
          height: height * 0.18,
          width: "100%",
          paddingTop: height * 0.08,
          backgroundColor: "red",
          paddingHorizontal: 20,
        }}
        colors={Colors.backgroundGradient}
      >
        <Header
          onPressRight={() => navigation.navigate("UserProfile")}
          rightIcon={Assets.userProfile}
          rightWidth={23}
          rightHeight={23}
          title={"Coachella Valley Music and Arts Festival"}
          friendsCounter={"6 friends"}
          navigation={navigation}
        />
      </LinearGradient>
      <View style={{ height: height * 0.82, width: "100%" }}>
        <Mapbox.MapView style={{ ...StyleSheet.absoluteFillObject }}>
          <Mapbox.Camera followZoomLevel={1} />
          <Mapbox.PointAnnotation coordinate={[78.9629, 20.5937]} id={"1"}>
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: "red",
                borderRadius: 50,
                borderColor: "#fff",
                borderWidth: 3,
              }}
            />
          </Mapbox.PointAnnotation>
          <Mapbox.MarkerView id={"marker"} coordinate={[72, 23]}>
            {/* <View> */}
            {/* <View
                style={{
                  alignItems: "center",
                  width: 60,
                  backgroundColor: "transparent",
                  height: 70,
                }}
              > */}
            <AssetImage
              asset={Assets.splash}
              width={24}
              height={24}
              containerStyle={{ backgroundColor: "red" }}
            />
            {/* </View> */}
            {/* </View> */}
          </Mapbox.MarkerView>

          <Mapbox.UserLocation />
        </Mapbox.MapView>
        <Pressable
          style={{ position: "absolute", left: 10, bottom: 58 }}
          onPress={() => navigation.navigate("Contacts")}
        >
          <AssetImage
            asset={Assets.addUser}
            width={normalize(90)}
            height={normalize(91)}
          />
        </Pressable>
        <Pressable style={{ position: "absolute", right: 10, bottom: 144.56 }}>
          <AssetImage
            asset={Assets.userPosition}
            width={normalize(90)}
            height={normalize(91)}
          />
        </Pressable>
        <Pressable style={{ position: "absolute", right: 10, bottom: 58 }}>
          <AssetImage
            asset={Assets.emrgButton}
            width={normalize(90)}
            height={normalize(91)}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default Map;
