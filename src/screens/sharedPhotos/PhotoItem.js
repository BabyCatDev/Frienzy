import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Text,
  Alert,
} from 'react-native';
import { DeletePhotoFromItinerary } from '../../services/firebase/itineraryService';

export const PhotoItem = ({ onPress, photo, isDisabled = false, owner, groupInfo }) => {
  const handleLongPress = () => {
    if (photo.owner == owner) {
      Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            DeletePhotoFromItinerary(groupInfo, photo.url);
            // Perform delete operation here
            console.log('Photo deleted');
          },
        },
      ]);
    }
  };
  return (
    <View style={styles.containerStyle}>
      <TouchableOpacity onPress={onPress} disabled={isDisabled} onLongPress={handleLongPress}>
        <ImageBackground
          style={styles.imageStyle}
          width={120}
          height={120}
          source={{
            uri: photo.url,
          }}
        >
          {photo.owner == owner ? <Text>*</Text> : <></>}
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    width: 120,
    height: 120,
    backgroundColor: 'white',
  },
  imageStyle: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
});
