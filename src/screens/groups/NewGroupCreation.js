import React, { useState, useCallback } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useWindowDimensions } from 'react-native';
import { Avatar } from '../../components/Avatar';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/Colors';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadingTransition,
} from 'react-native-reanimated';
import { AppStyles } from '../../utils/AppStyles';
import { getPhoto } from '../../services/helpers/photoPicker';
import normalize from 'react-native-normalize';
import ContactList from '../contactList';
import MyFriends from '../profile/MyFriends';
import PhotoUpload from '../onboarding/photoUpload';
import AddedFriendIcon from './AddedFriendIcon';
import { MainButton } from '../../components/MainButton';
import { useDispatch } from 'react-redux';
import { createNewGroup } from '../../services/firebase/conversations';

const IMAGE_SIZE = 50;
const IMAGE_GAP = 4;

const NewGroupCreation = ({ handlePresentModalPress }) => {
  const { close } = useBottomSheet();

  const [groupAvatar, setGroupAvatar] = useState('');
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [step, setStep] = useState(0);
  const dispatch = useDispatch();

  const createFrienzy = async () => {
    setLoading(true);
    await createNewGroup({
      name: groupName,
      pic: groupAvatar,
      members: selectedFriends,
    });
    setLoading(false);
    close();
  };

  const renderCurrentStep = () => {
    return (
      <>
        {step >= 0 ? (
          <PhotoUpload
            group
            setGroupName={setGroupName}
            groupAvatar={groupAvatar}
            groupName={groupName}
            setGroupAvatar={setGroupAvatar}
            groupSend={() => setStep(1)}
            step={step}
          />
        ) : null}
        {step >= 1 ? (
          <View style={{ width: '100%', marginTop: 20 }}>
            <Text
              style={localStyles.sectionHeader}
            >{`Add Friends (${selectedFriends.length})`}</Text>
            <FlatList
              data={selectedFriends}
              renderItem={({ item }) => <AddedFriendIcon uid={item} />}
              horizontal
              contentContainerStyle={{ marginVertical: 10 }}
              ListFooterComponent={() => {
                return (
                  <LinearGradient
                    style={{
                      width: normalize(60),
                      height: normalize(60),
                      borderRadius: normalize(30),
                      marginRight: normalize(-20),
                    }}
                    colors={Colors.mainGradient}
                    useAngle
                    angle={90}
                  >
                    <Pressable
                      style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => setShowFriends(true)}
                    >
                      <Ionicon name={'add'} color={'white'} size={normalize(25)} />
                    </Pressable>
                  </LinearGradient>
                );
              }}
            />
            <MainButton
              title="CREATE FRIENZY"
              isLoading={loading}
              onPress={async () => createFrienzy()}
              containerStyle={{
                marginTop: 30,
                alignSelf: 'center',
              }}
            />
          </View>
        ) : null}
        {step >= 2 ? (
          <PhotoUpload
            group
            setGroupName={setGroupName}
            groupAvatar={groupAvatar}
            groupName={groupName}
            setGroupAvatar={setGroupAvatar}
            groupSend={() => setStep(3)}
          />
        ) : null}
      </>
    );
  };

  return (
    <View style={localStyles.pageContainer}>
      <View style={localStyles.header}>
        {showFriends ? (
          <Pressable style={localStyles.headerLeftButton} onPress={() => setShowFriends(false)}>
            <Ionicon name={'chevron-back'} color={'white'} size={normalize(25)} />
          </Pressable>
        ) : null}
        <Text style={[localStyles.newMessageSectionHeader, { textAlign: 'center' }]}>
          {showFriends ? `Add Friends (${selectedFriends.length})` : 'Create New Frienzy'}
        </Text>
      </View>
      {showFriends ? (
        <MyFriends
          setSelectedFriends={setSelectedFriends}
          selectedFriends={selectedFriends}
          isSelecting
        />
      ) : (
        renderCurrentStep()
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  pageContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeftButton: {
    position: 'absolute',
    left: 20,
    zIndex: 100,
  },
  selectedText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  newMessageSectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    color: 'white',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '100%',
    color: 'white',
  },
  inputContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.darkText,
    borderRadius: 10,
    paddingRight: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
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
  nameHelper: {
    marginBottom: 10,
  },
  nameInput: {
    flex: 1,
  },
  infoContainer: {
    flex: 1,
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
});

export default NewGroupCreation;
