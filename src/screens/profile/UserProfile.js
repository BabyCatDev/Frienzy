import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import normalize from 'react-native-normalize';
import { Colors } from '../../utils/Colors';
import { AppStyles } from '../../utils/AppStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Avatar } from '../../components/Avatar';
import { Header } from '../../components/Header';
import { ProfileRow } from './ProfileRow';
import AuthProvider from '../../utils/AuthProvider';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import FGLocationRetriever from '../../services/FGLocationRetriever';
import QrOverlay from './QrOverlay';
import FBSaver from '../../services/FBSaver';
import { removeValue } from '../../utils/AsyncStore';
import DeleteAccountOverlay from './DeleteAccountOverlay';
import { useLocation } from '../../hooks/useLocation';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { setLocationEnabled } from '../../redux/actions/data/UserLocation';
import Ionicon from 'react-native-vector-icons/Ionicons';

const UserProfile = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isChange, setIsChange] = useState(false);
  const [visible, setVisible] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const scrollRef = React.useRef();
  const isAndroid = Platform.OS === 'android';
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.FrienzyAuth.userDetails);
  const userFriends = useSelector((state) => state.FrienzyAuth.userFriends);
  const userGroups = useSelector((state) => userDetails.groups || []);
  const enabled = useSelector((state) => state.FrienzyData.isEnabled);

  console.log('userDetails', userDetails);
  console.log('userFriends', userFriends);
  const firstName = useMemo(() => {
    const nameArr = name?.username?.split(' ');
    if (nameArr?.length > 1) {
      return nameArr[0];
    } else {
      return name?.username;
    }
  });

  const lastName = useMemo(() => {
    const nameArr = name?.username?.split(' ');
    if (nameArr?.length > 1) {
      return nameArr[1];
    } else {
      return '';
    }
  });

  const toggleLocationEnabled = () => {
    dispatch(setLocationEnabled(!enabled));
  };

  // const [locationSharing, setLocationSharing] = useState(
  //   FGLocationRetriever.getInstance().locationTrackingOn
  // );

  // useEffect(() => {
  //   if (locationSharing) {
  //     FGLocationRetriever.getInstance().startLocationTracking();
  //   } else {
  //     FGLocationRetriever.getInstance().stopLocationTracking();
  //   }
  // }, [locationSharing]);

  const onDeleteAccount = async () => {
    try {
      await AuthProvider.logoutUser();
      // FGLocationRetriever.getInstance().reset();
      await FBSaver.getInstance().reset();
      await removeValue('image');
      await removeValue('alarm');
      await removeValue('contacts');
      await removeValue('counter');
      await removeValue('selectedContactList');
      await removeValue('phoneNumber');
      dispatch(logout());
    } catch (e) {
      console.log(e);
    }
  };
  async function fetchData() {
    const key = FBSaver.getInstance().userKey;
    const phone = FBSaver.getInstance().keyToPhone[key];
    const user = await FBSaver.getInstance().getUserData();
    setName(user ? user : { username: 'Frienzy Nickname', profile_pic: '' });
    setPhone(phone ? phone : '+12345678901');
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <LinearGradient colors={Colors.backgroundGradient} style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        ref={scrollRef}
        contentContainerStyle={{ minHeight: isChange ? '50%' : '100%' }}
        extraScrollHeight={isAndroid ? 0 : 75}
        onKeyboardDidShow={() => {
          isAndroid && scrollRef.current.scrollForExtraHeightOnAndroid(25);
        }}
        onKeyboardWillHide={() => !isAndroid && setIsChange(false)}
        onKeyboardDidHide={() => isAndroid && setIsChange(false)}
      >
        <View
          style={{
            ...AppStyles.screenContainer,
            paddingTop: height * 0.08,
          }}
        >
          {/* HEADER */}
          <Header
            navigation={navigation}
            title={'Profile'}
            noBackButton={true}
            onPressRight={() => navigation.navigate('Settings')}
            rightIcon={() => (
              <Ionicon name={'settings-outline'} size={normalize(20)} color={'white'} />
            )}
          />
          {/* PROFILE */}
          <View style={{ alignItems: 'center', width: '100%', transform: [{ scale: 1 }] }}>
            {/* AVATAR  */}
            <Avatar username={userDetails?.name} profilePic={userDetails?.profilePic} />
            {/* NAME */}
            {!isChange ? (
              <View>
                <Text
                  style={{
                    ...AppStyles.semibold22,
                    marginTop: normalize(25),
                    alignSelf: 'center',
                  }}
                >
                  {userDetails?.name}
                </Text>
                <Text
                  style={{
                    ...AppStyles.medium17,
                    marginTop: normalize(5),
                    alignSelf: 'center',
                  }}
                >
                  {userDetails.phone}
                </Text>
              </View>
            ) : (
              <TextInput
                returnKeyType="done"
                autoFocus={true}
                textAlign="center"
                value={userDetails?.name}
                onChangeText={(text) => setName({ ...name, username: text })}
                style={AppStyles.profileInput}
                placeholderTextColor={Colors.darkText}
                onBlur={async () => {
                  await FBSaver.getInstance().saveUsername(name?.username);
                }}
              />
            )}
            {/* PHONE */}
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.push('MyFriends')}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  marginHorizontal: 10,
                  backgroundColor: '#1A1822',
                  borderWidth: 0.25,
                  borderColor: '#313132',
                  borderRadius: 10,
                  padding: 5,
                  width: '45%',
                }}
              >
                <Text style={{ ...AppStyles.semibold22, color: 'white', fontSize: 20 }}>
                  {userFriends?.length}
                </Text>
                <Text style={{ ...AppStyles.medium17, fontSize: 16, fontWeight: 'normal' }}>
                  Friends
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Groups')}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  marginHorizontal: 10,
                  backgroundColor: '#1A1822',
                  borderWidth: 0.25,
                  borderColor: '#313132',
                  borderRadius: 10,
                  padding: 5,
                  width: '45%',
                }}
              >
                <Text style={{ ...AppStyles.semibold22, color: 'white', fontSize: 20 }}>
                  {userGroups?.length}
                </Text>
                <Text style={{ ...AppStyles.medium17, fontSize: 16, fontWeight: 'normal' }}>
                  Frienzies
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ width: '100%' }}>
            {/* SHOW LOCATION */}
            <ProfileRow
              title={'Show location'}
              toggle
              toggleOn={enabled}
              defaultToggle={true}
              onToggle={() => toggleLocationEnabled()}
            />
            {/* PROFILE ROW */}
            <ProfileRow title={'Change Name'} onPress={() => setIsChange(!isChange)} />
            <ProfileRow title={'My QR code'} onPress={() => setVisible(true)} qrCode />
          </View>
        </View>
      </KeyboardAwareScrollView>
      {visible && (
        <QrOverlay
          setVisible={setVisible}
          phoneNumber={phone}
          firstName={firstName}
          lastName={lastName}
        />
      )}
      {confirm && (
        <DeleteAccountOverlay setVisible={setConfirm} onDeleteAccount={onDeleteAccount} />
      )}
    </LinearGradient>
  );
};

export default UserProfile;
