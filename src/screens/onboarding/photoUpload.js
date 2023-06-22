import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Image,
  Pressable,
  Alert,
  Linking,
  StyleSheet,
  Platform,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { MainButton } from '../../components/utils/MainButton';
import Toast from 'react-native-toast-message';
import { AppStyles } from '../../utils/AppStyles';
import { storeObject } from '../../utils/AsyncStore';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { saveNameAndPhoto } from '../../services/firebase/user';
import { useSelector } from 'react-redux';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { getPhoto } from '../../services/helpers/photoPicker';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import normalize from 'react-native-normalize';
import Ionicon from 'react-native-vector-icons/Ionicons';

const IMAGE_SIZE = 70;
const IMAGE_GAP = 4;

const PhotoUpload = ({
  group = false,
  setGroupName,
  groupAvatar,
  groupName,
  setGroupAvatar,
  groupSend,
  step = 0,
}) => {
  const imageSize = useSharedValue(step > 0 ? wp(20) : wp(70));
  const [response, setResponse] = useState(null);
  const [dataImage, setDataImage] = useState(null);
  const [showName, setShowName] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [groupLayoutColumn, setGroupLayoutColumn] = useState(step > 0 ? false : true);

  const userDetails = useSelector((state) => state.FrienzyAuth.userDetails);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: imageSize.value,
      height: imageSize.value,
    };
  });

  const getInitials = (name) => {
    const fullName = name;
    return fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .substr(0, 2);
  };

  const nextScreen = async () => {
    setLoading(true);
    await saveNameAndPhoto(userDetails.uid, dataImage, username);
    setLoading(false);
  };

  const goToName = () => {
    imageSize.value = withSpring(showName ? wp(70) : wp(30));
    setShowName(!showName);
  };

  useEffect(() => {
    console.log('image', dataImage);
  }, [dataImage]);

  const onImageButtonPressed = useCallback(() => {
    getPhoto(response, setResponse, group ? setGroupAvatar : setDataImage);
  }, [response]);

  const onGroupSendClick = () => {
    imageSize.value = withSpring(groupLayoutColumn ? wp(20) : wp(70));
    setGroupLayoutColumn(!groupLayoutColumn);
    groupSend();
  };

  const handlePress = () => {
    if (showName) {
      imageSize.value = withSpring(showName ? wp(70) : wp(30));
      setShowName(false);
    } else {
      onImageButtonPressed();
    }
  };

  if (group) {
    return (
      <View style={{ marginTop: 20, width: '100%' }}>
        <View style={[localStyles.pageContainer, { justifyContent: 'flex-start' }]}>
          <View
            style={{
              justifyContent: groupLayoutColumn ? 'flex-start' : 'center',
              alignItems: 'center',
              width: wp(90),
              flexDirection: groupLayoutColumn ? 'column' : 'row',
            }}
          >
            <Animated.View style={[localStyles.avatarContainer, animatedStyles]}>
              <Pressable onPress={() => handlePress()} style={{ width: '100%', height: '100%' }}>
                <LinearGradient colors={Colors.mainGradient} style={localStyles.avatarOutsideRing}>
                  <View style={localStyles.innerCircleContainer}>
                    <LinearGradient
                      colors={Colors.backgroundGradient}
                      style={localStyles.avatarOutside}
                    >
                      <View style={localStyles.innerCircleSecondContainer}>
                        <View style={localStyles.avatarImageContainer}>
                          {groupAvatar.length > 0 ? (
                            <Image
                              resizeMode="cover"
                              resizeMethod="scale"
                              style={localStyles.avatarImage}
                              source={{ uri: groupAvatar }}
                            />
                          ) : groupName.length > 0 ? (
                            <Text
                              style={{
                                ...AppStyles.medium70,
                                textAlign: 'center',
                                fontSize: groupLayoutColumn ? normalize(70) : normalize(25),
                              }}
                            >
                              {getInitials(groupName)}
                            </Text>
                          ) : (
                            <Text
                              style={{
                                ...AppStyles.medium13,
                                textAlign: 'center',
                                color: 'white',
                              }}
                            >
                              {'Set Group Pic\n(Optional)'}
                            </Text>
                          )}
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                </LinearGradient>
              </Pressable>
            </Animated.View>
            <View
              style={[
                localStyles.inputContainer,
                {
                  marginTop: groupLayoutColumn ? 30 : 0,
                  marginLeft: groupLayoutColumn ? 0 : 10,
                  flex: groupLayoutColumn ? null : 1,
                },
              ]}
            >
              <BottomSheetTextInput
                value={groupName}
                onChangeText={(e) => setGroupName(e)}
                style={{ flex: 1, ...AppStyles.medium16 }}
                placeholder="Name"
                autoFocus
              />
              {groupName.length > 0 && groupLayoutColumn ? (
                <Pressable style={localStyles.sendBtn} onPress={() => onGroupSendClick()}>
                  <LinearGradient colors={Colors.mainGradient} style={localStyles.sendBtnContainer}>
                    {loading ? (
                      <ActivityIndicator color={'#1A1822'} />
                    ) : (
                      <Ionicon name="arrow-up-outline" size={20} color={'white'} />
                    )}
                  </LinearGradient>
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <LinearGradient colors={Colors.backgroundGradient} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={20}
        >
          <View style={[localStyles.pageContainer, { height: '100%' }]}>
            <View style={localStyles.headerContainer}>
              <Text style={localStyles.titleText}>Profile Setup</Text>
            </View>
            <View style={localStyles.infoContainer}>
              <Animated.View style={[localStyles.avatarContainer, animatedStyles]}>
                <Pressable onPress={() => handlePress()} style={{ width: '100%', height: '100%' }}>
                  <LinearGradient
                    colors={Colors.mainGradient}
                    style={localStyles.avatarOutsideRing}
                  >
                    <View style={localStyles.innerCircleContainer}>
                      <LinearGradient
                        colors={Colors.backgroundGradient}
                        style={localStyles.avatarOutside}
                      >
                        <View style={localStyles.innerCircleSecondContainer}>
                          <View style={localStyles.avatarImageContainer}>
                            {(dataImage || userDetails?.profilePic?.length > 0) && (
                              <Image
                                resizeMode="cover"
                                resizeMethod="scale"
                                style={localStyles.avatarImage}
                                source={{
                                  uri: dataImage
                                    ? dataImage
                                    : userDetails?.profilePic?.length > 0
                                    ? userDetails.profilePic
                                    : null,
                                }}
                              />
                            )}
                          </View>
                        </View>
                      </LinearGradient>
                    </View>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
              <View style={[localStyles.inputContainer]}>
                {showName ? (
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...localStyles.nameHelper, ...AppStyles.medium13 }}>
                      What do your friends call you?
                    </Text>
                    <TextInput
                      value={username}
                      onChangeText={(e) => setUsername(e)}
                      style={{ ...localStyles.nameInput, ...AppStyles.medium16 }}
                      placeholder="Name"
                    />
                  </View>
                ) : (
                  <Text style={localStyles.subtitleText}>
                    An accurate profile image helps your friends recognize you and helps us combat
                    bots
                  </Text>
                )}
              </View>
            </View>
            {!showName ? (
              <MainButton
                title={'CONTINUE'}
                isLoading={false}
                onPress={() => goToName()}
                isDisabled={!(dataImage?.[0] || userDetails?.profilePic)}
              />
            ) : (
              <MainButton
                title={'FINISH SETUP'}
                isLoading={loading}
                onPress={() => nextScreen()}
                isDisabled={username?.length == 0}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const localStyles = StyleSheet.create({
  pageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  nameHelper: {
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  nameInput: {
    paddingRight: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.darkText,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    width: wp(90),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    justifyContent: 'center',
    flex: 0.4,
    width: wp(80),
  },
  titleText: {
    color: 'white',
    fontSize: 35,
    fontFamily: 'Poppins-Semibold',
    textAlign: 'center',
  },
  subtitleText: {
    color: 'gray',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  avatarContainer: {
    justifyContent: 'center',
  },
  avatarOutsideRing: {
    width: '100%',
    height: '100%',
    borderRadius: wp(IMAGE_SIZE / 2),
  },
  innerCircleContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOutside: {
    width: '95%',
    height: '95%',
    borderRadius: wp((IMAGE_SIZE - IMAGE_GAP) / 2),
  },
  innerCircleSecondContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImageContainer: {
    width: '95%',
    height: '95%',
    borderRadius: wp((IMAGE_SIZE - 2 * IMAGE_GAP) / 2),
    backgroundColor: Colors.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp((IMAGE_SIZE - 2 * IMAGE_GAP) / 2),
  },
  sendBtnContainer: {
    borderRadius: 10,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  sendBtn: {
    height: 30,
    width: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
});

export default PhotoUpload;
