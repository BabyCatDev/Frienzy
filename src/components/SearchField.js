import React from "react";
import { View, TextInput } from "react-native";
import { Colors } from "../utils/Colors";
import { AppStyles } from "../utils/AppStyles";
import Assets from "../assets";
import { AssetImage } from "../assets/asset_image";
import normalize from "react-native-normalize";

const SearchField = ({ search, setSearch, containerStyle }) => {
  return (
    <View style={containerStyle}>
      <View style={AppStyles.searchFieldContainer}>
        <TextInput
          placeholder="Name"
          placeholderTextColor={Colors.someGray}
          value={search}
          onChangeText={(text) => setSearch(text)}
          style={{
            ...AppStyles.medium15,
            color: Colors.lightText,
            ...AppStyles.searchField,
          }}
        />
        <AssetImage
          asset={Assets.searchIcon}
          width={normalize(21)}
          height={normalize(20)}
        />
      </View>
    </View>
  );
};

export default SearchField;
