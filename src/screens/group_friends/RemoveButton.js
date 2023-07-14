import React from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { AssetImage } from '../../assets/asset_image';
import Assets from '../../assets';

export const RemoveButton = ({ onPress, isDisabled = false, isLoading = false }) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress} disabled={isDisabled} style={styles.removeButton}>
        {isLoading ? (
          <View>
            <Ionicon name="trash" size={50} color="#FB5F2D" />
            <ActivityIndicator
              size="small"
              color="white"
              style={{ position: 'absolute', top: 15, left: 15 }}
            />
          </View>
        ) : (
          // <ActivityIndicator size="small" color="white" />

          <Ionicon name="trash" size={50} color={isDisabled ? '#404040' : '#FB5F2D'} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    width: 120,
    height: 120,
    backgroundColor: '#FB5F2D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },

  removeButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    zIndex: 1, // Ensure the button is above the ScrollView
  },
});
