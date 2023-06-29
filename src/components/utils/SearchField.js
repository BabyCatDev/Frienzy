import React from "react";
import { View, TextInput } from "react-native";
import { Colors } from "../../utils/Colors";
import { AppStyles } from "../../utils/AppStyles";
import Assets from "../../assets";
import { AssetImage } from "../../assets/asset_image";
import normalize from "react-native-normalize";

const SearchField = ({ search, setSearch, containerStyle, 
  backgroundColor = Colors.moreBlack, textColor = Colors.lightText,
  placeholderColor = Colors.someGray
}) => {
  return (
    <View style={containerStyle}>
      <View style={[AppStyles.searchFieldContainer, {backgroundColor}]}>
        <TextInput
          placeholder="Name"
          placeholderTextColor={placeholderColor ?? Colors.someGray}
          value={search}
          onChangeText={(text) => setSearch(text)}
          style={{
            ...AppStyles.medium15,
            color: textColor ?? Colors.lightText,
            ...AppStyles.searchField,
            backgroundColor: backgroundColor
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
