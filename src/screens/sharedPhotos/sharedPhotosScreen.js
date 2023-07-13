import React, { useState, useRef } from 'react';
import {
  View,
  ActionSheetIOS,
  Image,
  StyleSheet,
  Button,
  Dimensions,
  TouchableOpacity,
  Modal,
  Text,
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import ImageView from 'react-native-image-viewing';

import { PlusButton } from './PlusButton';
import { useGroup } from '../../hooks/useGroup';
import { addPhotoToItinerary } from '../../services/firebase/itineraryService';
import { useSelector } from 'react-redux';
import { PhotoItem } from './PhotoItem';
import { setSelectedContacts } from '../../utils/helper';
// import { MultipleImagePicker } from '@baronha/react-native-multiple-image-picker';

const pickerOptions = {
  mediaType: 'photo',
  // multiple: true,
  // maxSelectedAssets: 5,
  includeBase64: false,
};
const screenWidth = Dimensions.get('window').width;

export const SharedPhotosScreen = ({ route }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const { currentGroup } = route.params;
  const { groupInfo } = useGroup(currentGroup);
  const userDetails = useSelector((state) => state.FrienzyAuth.userDetails);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setsSelectedItem] = useState([]);
  const [visible, setIsVisible] = useState(false);

  const handlePlusClick = async () => {
    const options = ['Open Camera', 'Open Library', 'Cancel'];
    const cancelButtonIndex = 2;
    let selectedIndex = 1;
    // showActionSheetWithOptions({
    //   options,
    //   cancelButtonIndex,
    // }, async (selectedIndex) => {
    try {
      let result = null;
      setLoading(true);
      switch (selectedIndex) {
        case 0:
          result = await launchCamera(pickerOptions);
          break;
        case 1:
          // result = await launchImageLibrary(pickerOptions);
          try {
            result = await ImagePicker.openPicker({
              multiple: true,
            });
          } catch (error) {
            console.log(error);
          }
          break;
      }
      if (result) {
        for (var i = 0; i < result.length; i++) {
          await addPhotoToItinerary(userDetails.uid, groupInfo, result[i].path);
          console.log(result[i].path);
        }
        setLoading(false);
      }
    } catch (e) {
      console.log('photo upload failed', e);
      setLoading(false);
    }
    //});
  };

  const photos = ['+', ...(groupInfo?.photos ?? [])];
  // const images = [...(groupInfo?.photos ?? [])];
  let images = [];
  (groupInfo?.photos ?? []).map((item, key) => (images = [...images, { uri: item.url }]));
  console.log('----------images----------', images);
  return (
    <View style={styles.container}>
      <FlatGrid
        itemDimension={100}
        maxItemsPerRow={3}
        spacing={5}
        data={photos}
        renderItem={({ item, index }) =>
          item == '+' ? (
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
                setsSelectedItem(index);
                setIsVisible(true);
              }}
              photo={item}
              owner={userDetails.uid}
              groupInfo={groupInfo}
            />
          )
        }
      />
      <ImageView
        images={images}
        imageIndex={selectedItem - 1}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
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
