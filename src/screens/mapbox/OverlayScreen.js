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
import { AppStyles } from '../../utils/AppStyles';
import normalize from 'react-native-normalize';
import FGLocationRetriever from '../../services/FGLocationRetriever';
import FBSaver from '../../services/FBSaver';

const OverlayScreen = ({ setVisible, userToPush }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    async function fetchData() {
      const user = await FBSaver.getInstance().getUserData();
      setName(user.username);
    }
    fetchData();
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
            ...AppStyles.medium17,
            lineHeight: normalize(26),
            paddingBottom: normalize(40),
          }}
        >
          Click to send the message
        </Text>
        <TouchableOpacity
          onPress={() => {
            // FGLocationRetriever.getInstance().sendNotiffication(
            //   userToPush,
            //   name,
            //   "Come to me.\nI'm standing still."
            // );
            setVisible(false);
          }}
          style={{
            backgroundColor: '#221F2D',
            paddingHorizontal: normalize(15),
            paddingVertical: normalize(15),
            borderRadius: 10,
            width: '100%',
            justifyContent: 'center',
            marginBottom: normalize(20),
          }}
        >
          <Text
            style={{
              ...AppStyles.semibold17,
              lineHeight: normalize(26),
              textAlign: 'center',
            }}
          >
            {"Come to me.\nI'm standing still."}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // FGLocationRetriever.getInstance().sendNotiffication(
            //   userToPush,
            //   name,
            //   "I'm coming to you.\nStay where you are."
            // );
            setVisible(false);
          }}
          style={{
            backgroundColor: '#221F2D',
            paddingHorizontal: normalize(15),
            paddingVertical: normalize(15),
            borderRadius: 10,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              ...AppStyles.semibold17,
              lineHeight: normalize(26),
              textAlign: 'center',
            }}
          >
            {"I'm coming to you.\nStay where you are."}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default OverlayScreen;
