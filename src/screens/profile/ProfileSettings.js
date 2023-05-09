// write a settings screen

import React, { useState, useDispatch, useEffect, useMemo } from 'react';
import { View, Text, useWindowDimensions, Platform, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/Colors';
import { Header } from '../../components/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppStyles } from '../../utils/AppStyles';
import normalize from 'react-native-normalize';
import { ProfileRow } from './ProfileRow';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


const ProfileSettings = ({ navigation }) => {
    const { height } = useWindowDimensions();
    const scrollRef = React.useRef();
    const [isChange, setIsChange] = useState(false);
    const [visible, setVisible] = useState(false);
    const [confirm, setConfirm] = useState(false);
    // const dispatch = useDispatch();
    // const userDetails = useSelector((state) => state.FrienzyAuth.userDetails);
    // const userFriends = useSelector((state) => state.FrienzyAuth.userFriends);
    // const enabled = useSelector((state) => state.FrienzyData.isEnabled);


    const onLogout = async () => {
        try {
          await firestore().collection('users').doc(auth().currentUser.uid).update({ loggedIn: false });
          auth()
            .signOut()
            .then(() => console.log('User signed out!'));
        } catch (e) {
          console.log(e);
        }
      };

    return (
        <LinearGradient colors={Colors.backgroundGradient} style={{ flex: 1 }}>
            <KeyboardAwareScrollView
                ref={scrollRef}
                contentContainerStyle={{ minHeight: isChange ? '50%' : '100%' }}
                // extraScrollHeight={isAndroid ? 0 : 75}
                onKeyboardDidShow={() => {
                    isAndroid && scrollRef.current.scrollForExtraHeightOnAndroid(25);
                }}
            // onKeyboardWillHide={() => !isAndroid && setIsChange(false)}
            // onKeyboardDidHide={() => isAndroid && setIsChange(false)}
            >
                <View
                    style={{
                        ...AppStyles.screenContainer,
                        paddingTop: height * 0.08,
                    }}
                >
                    <Header navigation={navigation} title={'Settings'} noBackButton={false} />
                    <View style={{ width: '100%', marginTop: normalize(60) }}>
                    <ProfileRow title={'Log out'} onPress={async () => await onLogout()} />
                    {/* <ProfileRow title={'Delete account'} onPress={() => setConfirm(true)} /> */}
                </View>
                </View>
            </KeyboardAwareScrollView>
        </LinearGradient>
    );
}

export default ProfileSettings;