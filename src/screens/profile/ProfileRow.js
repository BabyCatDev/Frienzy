import React, {useState} from "react";
import { View, Text, Pressable } from "react-native";
import { AssetImage } from "../../assets/asset_image";
import Assets from "../../assets";
import normalize from "react-native-normalize";
import { MemoToggle } from "../../components/toggle";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../utils/Colors";

export const ProfileRow = ({ navigation, title, toggle, onPress }) => {
    const [toggleOn, setToggleOn] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        // backgroundColor: "red",
        width: "100%",
        justifyContent: "space-between",
        marginBottom: normalize(25),
      }}
    >
      <Text
        style={{
          color: "#9496A2",
          fontSize: normalize(17),
          lineHeight: normalize(20.62),
          fontFamily: "Poppins-Medium",
        }}
      >
        {title}
      </Text>
      {!toggle && <View
        style={{
          width: normalize(20.62),
          height: normalize(20.62),
          justifyContent: "center",
        }}
      >
        <AssetImage
          asset={Assets.arrowBack}
          width={normalize(7)}
          height={normalize(12)}
          containerStyle={{
            transform: [{ rotate: "180deg" }],
          }}
        />
      </View>}
      {toggle && <MemoToggle
      onToggle={() => setToggleOn(!toggleOn)}
        isOn={toggleOn}
        onColor={'#9496A2'}
        offColor={"#2C2937"}
        style={{
          width: normalize(34),
          height: normalize(15.45),
        }}
      />}
    </Pressable>
  );
};
