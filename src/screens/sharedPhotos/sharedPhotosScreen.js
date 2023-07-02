import React, { useState, useRef } from 'react';
import { View, ActionSheetIOS, Image, StyleSheet, Button, Dimensions, TouchableOpacity, Modal, Text } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import ImageView from "react-native-image-viewing";

import { PlusButton } from './PlusButton';
import { useGroup } from '../../hooks/useGroup';
import { addPhotoToItinerary } from '../../services/firebase/itineraryService';
import { useSelector } from 'react-redux';
import { PhotoItem } from './PhotoItem';
import { setSelectedContacts } from '../../utils/helper';

const pickerOptions = {
  mediaType: "photo",
  quality: 0.8,
  includeBase64: false,
};
const screenWidth = Dimensions.get('window').width;

export const SharedPhotosScreen = ({ route }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const { currentGroup } = route.params;
  const { groupInfo } = useGroup(currentGroup);
  const userDetails = useSelector((state) => state.FrienzyAuth.userDetails);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setsSelectedImages] = useState([]);
  const [visible, setIsVisible] = useState(false);

  const handlePlusClick = async () => {
    const options = ['Open Camera', 'Open Library', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
    }, async (selectedIndex) => {
      try {
        let result = null;
        setLoading(true);
        switch (selectedIndex) {
          case 0:          
            result = await launchCamera(pickerOptions);
            break;
          case 1:          
            result = await launchImageLibrary(pickerOptions);
            break;
        }
        if (result && result.assets) {
          await addPhotoToItinerary(userDetails.uid, groupInfo, result.assets[0].uri);
        }
        setLoading(false);
      } catch (e) {
        console.log("photo upload failed", e);
        setLoading(false);
      }
    }); 
  }

  const photos = [
    "+",
    ...(groupInfo?.photos ?? []),
  ];

  return (
    <View style={styles.container}>
      <FlatGrid
        itemDimension={100}
        maxItemsPerRow={3}
        spacing={0}
        data={photos}
        renderItem={({ item }) => (
          item == "+" ? (
            <PlusButton
              isLoading={loading}
              isDisabled={loading}
              onPress={() => {
                handlePlusClick();
              }}
            />
          ) : (
            <PhotoItem
              onPress={() => {
                setsSelectedImages([{
                  uri: item.url
                }]);
                setIsVisible(true);
              }}              
              photo={item}
            />
          )
        )}
      />
      <ImageView
        images={selectedImages}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
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
