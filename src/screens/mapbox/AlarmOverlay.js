import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import normalize from 'react-native-normalize';
import FGLocationRetriever from '../../services/FGLocationRetriever';
import { storeObject } from '../../utils/AsyncStore';
import FBSaver from '../../services/FBSaver';
import { AssetImage } from '../../assets/asset_image';
import Assets from '../../assets';

const AlarmOverlay = ({ setVisible, usersToPush, setAlarmDisabled }) => {
  const [name, setName] = useState('');
  useEffect(() => {
    const getName = async () => {
      const user = await FBSaver.getInstance().getUserData();
      if (user != null) {
        setName(user.username);
      }
    };
    getName();
  }, []);

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 22,
      }}
    >
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <BlurView
          style={{
            ...StyleSheet.absoluteFillObject,
          }}
          blurType="dark"
          blurAmount={Platform.OS === 'ios' ? 2 : 11}
        />
      </TouchableWithoutFeedback>
      <LinearGradient
        style={{
          width: '100%',
          borderRadius: 20,
          padding: normalize(49),
          alignItems: 'center',
        }}
        colors={['#1A1822', '#12101A']}
      >
        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            fontSize: normalize(22),
            lineHeight: normalize(33),
            color: '#EEF0FF',
            paddingBottom: normalize(5),
          }}
        >
          ARE YOU IN TROUBLE?
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            fontSize: normalize(17),
            lineHeight: normalize(26),
            color: '#9496A2',
            textAlign: 'center',
            paddingBottom: normalize(40),
          }}
        >
          {'Click the help button\nto notify all your friends'}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            await Promise.all(
              usersToPush.map((user) => {
              })
            );
            FBSaver.getInstance().updateAlarm(true);
            setVisible(false);
            await storeObject('alarm', true);
            setAlarmDisabled(true);
          }}
          style={{
            backgroundColor: '#221F2D',
            borderRadius: 6,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <LinearGradient
            colors={['#FF6D6D', '#EB1D1D']}
            style={{ borderRadius: 6, paddingVertical: normalize(52) }}
            useAngle={true}
            angle={136.62}
          >
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: normalize(35),
                lineHeight: normalize(43),
                color: '#EEF0FF',
                textAlign: 'center',
              }}
            >
              {'Help me ASAP'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setVisible(false)}
          style={{
            position: 'absolute',
            top: normalize(13),
            right: normalize(13),
          }}
        >
          <AssetImage asset={Assets.xClose} width={normalize(20)} height={normalize(20)} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default AlarmOverlay;
