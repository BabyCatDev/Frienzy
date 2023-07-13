import React, { memo, useState, useEffect } from 'react';
import { View, Pressable, Text } from 'react-native';
import Assets from '../../assets';
import { AssetImage } from '../../assets/asset_image';
import normalize from 'react-native-normalize';

const ItineraryMarker = memo(({ number }) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          paddingHorizontal: 3,
        }}
      >
        <AssetImage asset={Assets.mapMarker} width={normalize(40)} height={normalize(40)} />
        <Text
          style={{
            position: 'absolute',
            top: 5,
            left: 15,
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
      </View>
    </View>
  );
});

export default ItineraryMarker;
