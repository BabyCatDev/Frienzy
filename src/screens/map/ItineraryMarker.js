import React, { memo, useState, useEffect } from 'react';
import { View, Pressable, TouchableOpacity } from 'react-native';
import Assets from '../../assets';
import { AssetImage } from '../../assets/asset_image';
import { Text } from 'react-native-elements';

import normalize from 'react-native-normalize';

const ItineraryMarker = memo(({ number, onpress }) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        style={{
          paddingHorizontal: 3,
        }}
        onPress={() => {
          onpress(number);
        }}
      >
        <AssetImage asset={Assets.mapMarker} width={normalize(40)} height={normalize(40)} />
        <Text
          style={{
            position: 'absolute',
            top: 5,
            left: 13,
            width: 20,
            borderRadius: 10,
            textAlign: 'center',
            backgroundColor: 'white',
            color: '#FB5F2E',
            fontSize: normalize(14),
            fontFamily: 'Poppins-Medium',
          }}
        >
          {number}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export default ItineraryMarker;
