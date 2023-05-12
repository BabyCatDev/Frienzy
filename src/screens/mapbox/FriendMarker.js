import React, { memo, useState, useEffect } from 'react';
import { View, Pressable, Text } from 'react-native';
import Assets from '../../assets';
import { AssetImage } from '../../assets/asset_image';
import normalize from 'react-native-normalize';
import CacheImage from '../../utils/CacheImage';

const FriendMarker = memo(({ contact, setUserToPush, setVisible }) => {
  const [viewTime, setViewTime] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(
    (Date.now() / 1000 - new Date(contact.time) / 1000).toFixed(0)
  );


  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate((Date.now() / 1000 - new Date(contact.time) / 1000).toFixed(0));
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  console.log('contact', contact)

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Pressable
        onPress={() => {
          setViewTime(!viewTime);
        }}
        onLongPress={() => {
          setUserToPush(contact);
          setVisible(true);
        }}
      >
        <AssetImage asset={Assets.userMarker} width={normalize(51)} height={normalize(56)} />
        <View
          style={{
            width: normalize(51),
            height: normalize(51),
            position: 'absolute',
            borderRadius: normalize(26),
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {contact.profilePic ? (
            <CacheImage
              source={{
                uri: contact.profilePic,
              }}
              cacheKey={contact.key}
              style={{
                width: normalize(45),
                height: normalize(45),
                borderRadius: 23,
              }}
            />
          ) : (
            <View
              style={{
                width: normalize(45),
                height: normalize(45),
                borderRadius: normalize(23),
                backgroundColor: Colors.darkGray,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              children={
                <Text style={{ color: Colors.white, fontSize: normalize(18) }}>
                  {getInitials(contact.name)}
                </Text>
              }
            />
          )}
        </View>
      </Pressable>
      {viewTime ? (
        <View
          style={{
            backgroundColor: '#EBEBEB',
            borderRadius: 10,
            paddingHorizontal: 3,
          }}
        >
          <Text
            style={{
              color: 'black',
              fontSize: normalize(14),
              fontFamily: 'Poppins-Medium',
            }}
          >
            {lastUpdate < 60
              ? `${lastUpdate} sec ago`
              : lastUpdate < 3600
              ? `${(lastUpdate / 60).toFixed(0)} min ago`
              : `${(lastUpdate / 60 / 60).toFixed(0)} hrs ago`}
          </Text>
        </View>
      ) : null}
    </View>
  );
});

export default FriendMarker;
