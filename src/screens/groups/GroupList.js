import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  useWindowDimensions,
  StyleSheet,
  FlatList,
  View,
  Modal,
  Text,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/Colors';
import { Colors as AppColors } from '../../utils/AppConstants';
import { Header } from '../../components/Header';
import SearchField from '../../components/SearchField';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import normalize from 'react-native-normalize';
import GroupListItem from './GroupListItem';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';

import NewGroupCreation from './NewGroupCreation';
import { useRoute } from '@react-navigation/native';
import { useGroupById } from '../../hooks/useThread';
import { addUserToGroup, getGroupById } from '../../services/firebase/conversations';

const GroupsList = ({ navigation, route }) => {
  const { threadId } = route.params;
  const { height } = useWindowDimensions();
  const [groupList, setGroupList] = useState([]);
  const [query, setQuery] = useState('');
  const conversations = useSelector((state) => state.FrienzyData.conversations);
  const userDetails = useSelector((state) => state.FrienzyAuth.userDetails);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const [joinGroupName, setJoinGroupName] = useState('');
  const [joinGroupOwner, setJoinGroupOwner] = useState('');

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const bottomSheetModalRef = useRef(null);

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const contentContainerStyle = useMemo(
    () => [{ paddingBottom: safeBottomArea || 6 }],
    [safeBottomArea]
  );

  useEffect(() => {
    async function getId() {
      if (threadId) {
        if (conversations.find((group) => group.id == threadId) > -1) {
          navigation.push('GroupThread', { threadId: threadId });
        } else {
          const threadData = await getGroupById(threadId);
          setJoinGroupName(threadData.name);
          setJoinGroupOwner(threadData.createdBy);
          setShowJoinGroupModal(true);
        }
      }
    }
    getId();
  }, []);

  // duplicate-outline
  // create-outline
  // person-add
  // people-circle
  // people-outline

  const handleNoPress = () => {
    // Remove from invite
    setShowJoinGroupModal(!showJoinGroupModal);
  };

  const handleYesPress = async () => {
    // Add them to the frienzy
    await addUserToGroup(threadId, userDetails.uid, joinGroupOwner);
    setShowJoinGroupModal(!showJoinGroupModal);
  };

  const handlePresentModalPress = useCallback(
    (index) => {
      if (!showNewGroupModal) {
        setShowNewGroupModal(true);
        bottomSheetModalRef.current?.present();
      } else {
        setShowNewGroupModal(false);
        bottomSheetModalRef.current?.dismiss();
      }
    },
    [showNewGroupModal]
  );

  return (
    <LinearGradient
      colors={Colors.backgroundGradient}
      style={{ flex: 1, paddingTop: height * 0.08, paddingHorizontal: 20 }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={showJoinGroupModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setShowJoinGroupModal(!showJoinGroupModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={styles.modalText}
            >{`You have been invited to ${joinGroupName}. Would you like to join?`}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Pressable style={[styles.button, styles.noButton]} onPress={() => handleNoPress()}>
                <Text style={styles.textStyle}>No</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.yesButton]} onPress={() => handleYesPress()}>
                <Text style={styles.textStyle}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View>
        <Header
          onPressRight={handlePresentModalPress}
          rightIcon={() => (
            <Ionicon color={'white'} name={'duplicate-outline'} size={normalize(23)} />
          )}
          title={'Frienzies'}
          friendsCounter={
            conversations
              ? conversations.length === 1
                ? '1 Frienzy'
                : `${conversations.length} Frienzies`
              : '0 Frienzies'
          }
          navigation={navigation}
          noBackButton
          containerStyle={{ marginBottom: 15 }}
        />
        <SearchField search={query} setSearch={setQuery} />
      </View>
      <FlatList
        data={conversations}
        renderItem={({ item, index }) => (
          <GroupListItem
            item={item}
            index={index}
            onPress={({ itemClicked }) => console.log(itemClicked.id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: '#1F1D27' }}
        handleIndicatorStyle={{ backgroundColor: 'white' }}
        onDismiss={() => setShowNewGroupModal(false)}
      >
        <BottomSheetView style={contentContainerStyle} onLayout={handleContentLayout}>
          <NewGroupCreation handlePresentModalPress={handlePresentModalPress} />
        </BottomSheetView>
      </BottomSheetModal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  contentContainerStyle: {
    paddingTop: 12,
    paddingBottom: 6,
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    color: 'black',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#1F1D27',
    borderRadius: 20,
    maxWidth: '75%',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
    width: 70,
  },
  noButton: {
    backgroundColor: AppColors.additional.red[70],
  },
  yesButton: {
    backgroundColor: AppColors.additional.green[100],
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});

export default GroupsList;
