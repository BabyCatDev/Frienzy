import { Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export const selectImage = (setImage) => {
  const options = {
    mediaType: 'photo',
    quality: 1,
    allowsEditing: true,
  };

  launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled the process');
    } else if (response.error) {
      console.log('ImagePicker Error:', response.error);
    } else {
      console.log('ImagePicker response >>>>', response.assets[0].uri);
      const uri = response.assets[0].uri;
      setImage(uri);
    }
  });
};

  