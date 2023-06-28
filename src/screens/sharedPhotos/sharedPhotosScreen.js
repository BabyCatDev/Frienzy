import React, { useState, useRef } from 'react';
import { View, ScrollView, Image, StyleSheet, Button, Dimensions, TouchableOpacity, Modal, Linking } from 'react-native';
import { RNCamera } from 'react-native-camera';

export const SharedPhotosScreen = () => {
  const [sharedPhotos, setSharedPhotos] = useState([
    {
      id: 1,
      imageUrl: 'https://dummyimage.com/300x200/000000/ffffff&text=Photo+1',
    },
    {
      id: 2,
      imageUrl: 'https://dummyimage.com/300x200/000000/ffffff&text=Photo+2',
    },
    {
      id: 3,
      imageUrl: 'https://dummyimage.com/300x200/000000/ffffff&text=Photo+3',
    },
    {
      id: 4,
      imageUrl: 'https://dummyimage.com/300x200/000000/ffffff&text=Photo+4',
    },
    // Add more photos here
  ]);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isCameraOpen, setCameraOpen] = useState(false);
  const cameraRef = useRef(null);

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);

      const newPhoto = {
        id: sharedPhotos.length + 1,
        imageUrl: data.uri,
      };
      setSharedPhotos([...sharedPhotos, newPhoto]);
      setCameraOpen(false);
    }
  };

  const handleOpenCamera = () => {
    setCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setCameraOpen(false);
  };

  const handlePhotoPress = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleModalClose = () => {
    setSelectedPhoto(null);
  };

  // const handleDownloadAlbum = () => {
  //   const albumUrls = sharedPhotos.map((photo) => photo.imageUrl);
  //   const albumUrlString = albumUrls.join('\n');
  //   Linking.openURL(`data:text/plain;charset=utf-8,${encodeURIComponent(albumUrlString)}`);
  // };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="+" onPress={handleOpenCamera} />
      </View>
      {isCameraOpen ? (
        <RNCamera
          ref={cameraRef}
          style={styles.cameraPreview}
          type={RNCamera.Constants.Type.back}
          captureAudio={false}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.photoGrid}>
          {sharedPhotos.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              onPress={() => handlePhotoPress(photo)}
            >
              <Image
                source={{ uri: photo.imageUrl }}
                style={styles.photo}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {isCameraOpen && (
        <Button title="Take Photo" onPress={handleTakePhoto} />
      )}
      <Modal
        visible={!!selectedPhoto}
        transparent={true}
        onRequestClose={handleModalClose}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={handleModalClose}
        >
          <Image
            source={{ uri: selectedPhoto?.imageUrl }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

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
