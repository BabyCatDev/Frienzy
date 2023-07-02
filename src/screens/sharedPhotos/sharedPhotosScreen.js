import React, { useState, useRef } from 'react';
import { View, ScrollView, Image, StyleSheet, Button, Dimensions, TouchableOpacity, Modal, Text } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import { PlusButton } from './PlusButton';
import { useGroup } from '../../hooks/useGroup';
import { addPhotoToItinerary } from '../../services/firebase/itineraryService';
import { useSelector } from 'react-redux';
import { PhotoItem } from './PhotoItem';

const pickerOptions = {
  mediaType: "photo",
  quality: 0.8,
  includeBase64: false,
};
const screenWidth = Dimensions.get('window').width;

export const SharedPhotosScreen = ({ route }) => {
  const { currentGroup } = route.params;
  const { groupInfo } = useGroup(currentGroup);
  const userDetails = useSelector((state) => state.FrienzyAuth.userDetails);
  console.log("groupInfo", groupInfo, userDetails);

  const handlePlusClick = async () => {    
    const result = await launchCamera(pickerOptions);
    if (result.assets) {
      addPhotoToItinerary(userDetails.uid, groupInfo, result.assets[0].uri);
    }    
  }

  const photos = [
    "+",
    ...(groupInfo?.photos ?? [])
  ];

  return (
    <View style={styles.container}>
      <FlatGrid
        itemDimension={120}
        maxItemsPerRow={3}
        data={photos}
        renderItem={({ item }) => (
          item == "+" ? (
            <PlusButton
              onPress={() => {
                handlePlusClick();
              }}
            />
          ) : (
            <PhotoItem
              onPress={() => {

              }}              
              photo={item}
            />
          )
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photo: {
    width: 80, // Adjust the width based on your grid layout
    height: 100,
    marginBottom: 16,
  },
  cameraPreview: {
    flex: 1,
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
