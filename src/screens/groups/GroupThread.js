import Ionicon from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ActivityIndicator, SafeAreaView, Text, Pressable, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Composer, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import { useGroupById, useThread } from '../../hooks/useThread';
import { Colors } from '../../utils/Colors';
import MessageCard from './MessageCard';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../../components/utils/Header';
import { sendMessage } from '../../services/firebase/conversations';
import normalize from 'react-native-normalize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import SettingsModal from './SettingsModal';
import { getFriendsForUser } from '../../services/firebase/user';
import { sendNotification } from '../../services/firebase/notification';

const GroupThread = ({ navigation, route }) => {
  const { threadId } = route.params;
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [locked, setLocked] = useState(false);

  const { thread } = useThread(threadId);
  const { data: threadData, isLoading } = useGroupById(threadId);
  const [members, setMembers] = useState([]);

  const userDetails = useSelector((state) => state.FrienzyAuth.userDetails);

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const { bottom: safeBottomArea } = useSafeAreaInsets();
  const bottomSheetModalSettingsRef = useRef(null);

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const contentContainerStyle = useMemo(
    () => [localStyles.contentContainerStyle, { paddingBottom: safeBottomArea || 6 }],
    [safeBottomArea]
  );

  const renderItem = ({ item, prev, next }) => {
    return <MessageCard item={item} prev={prev} next={next} />;
  };

  useEffect(() => {
    if (!threadData) return;
    if (!threadData.members.includes(auth().currentUser.uid)) {
      setLocked(true);
    } else {      
      const fIds = threadData.members.filter((e) => e != auth().currentUser.uid);
      getFriendsForUser(fIds).then((data) => {
        setMembers(data ?? []);
      });
    }
  }, [threadData]);

  useEffect(() => {
    async function setUp() {
      await firestore()
        .collection('groups')
        .doc(threadId)
        .update({
          [`recentMessage.readBy.${userDetails.uid}`]: true,
        });
    }
    setUp();
  }, [route]);

  const handleSendMessage = async () => {
    const newMessage = {
      text: message,
      sentBy: userDetails.uid,
      sentAt: firestore.FieldValue.serverTimestamp(),
    };

    setLoading(true);
    setMessage(null);
    await sendMessage(newMessage, threadId, userDetails);
    const tokens = members.filter((e) => !!e["fcm_token"]).map((e) => e["fcm_token"]);
    await sendNotification({
      tokens: tokens,
      title: "New Message from Frienzy",
      message: message
    })
    setLoading(false);
  };

  const handlePresentModalPress = useCallback(
    (index) => {
      if (!showSettingsModal) {
        setShowSettingsModal(true);
        bottomSheetModalSettingsRef.current?.present();
      } else {
        setShowSettingsModal(false);
        bottomSheetModalSettingsRef.current?.dismiss();
      }
    },
    [showSettingsModal]
  );

  const renderSend = (props) => {
    return (
      <Send {...props} style={styles.sendBtn}>
        <LinearGradient colors={Colors.mainGradient} style={styles.sendBtnContainer}>
          {loading ? (
            <ActivityIndicator color={'#1A1822'} />
          ) : (
            <Ionicon name="arrow-up-outline" size={20} color={'white'} />
          )}
        </LinearGradient>
      </Send>
    );
  };

  const renderActions = (props) => {
    console.log('action props', props);
    return (
      <View style={styles.buttonRow}>
        <Pressable style={styles.newMessageButton} onPress={() => console.log('location pressed')}>
          <Ionicon name="locate-outline" size={20} color={'white'} />
        </Pressable>
      </View>
    );
  };

  const renderComposer = (props) => {
    return <Composer textInputStyle={{ color: 'white' }} {...props} />;
  };

  const renderInputToolbar = (props) => {
    return <InputToolbar containerStyle={styles.messageContainer} {...props} />;
  };

  // const onSend = useCallback(async (messages = []) => {
  //     setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  // }, [])

  if (locked) {
    return (
      <LinearGradient colors={Colors.backgroundGradient} style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            onPressRight={handlePresentModalPress}
            rightIcon={() => (
              <Ionicon name={'ellipsis-horizontal'} size={normalize(20)} color={'white'} />
            )}
            title={threadData.name}
            navigation={navigation}
            containerStyle={{ paddingHorizontal: 20, marginBottom: 20 }}
          />
          <Text>{`You have been invited to ${threadData.name}. Do you want to join?`}</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={Colors.backgroundGradient} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          onPressRight={handlePresentModalPress}
          rightIcon={() => (
            <Ionicon name={'ellipsis-horizontal'} size={normalize(20)} color={'white'} />
          )}
          title={threadData?.name}
          navigation={navigation}
          containerStyle={{ paddingHorizontal: 20, marginBottom: 20 }}
        />
        <GiftedChat
          messages={thread}
          onSend={async () => {
            await handleSendMessage();
          }}
          renderBubble={({ currentMessage, nextMessage, previousMessage }) => {
            return renderItem({
              item: currentMessage,
              prev: previousMessage ?? null,
              next: nextMessage ?? null,
            });
          }}
          text={message}
          onInputTextChanged={(text) => setMessage(text)}
          alwaysShowSend
          renderAvatar={null}
          inverted={false}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          user={{
            _id: userDetails.uid,
          }}
        />
      </SafeAreaView>
      <BottomSheetModal
        ref={bottomSheetModalSettingsRef}
        index={0}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: '#1F1D27' }}
        handleIndicatorStyle={{ backgroundColor: 'white' }}
        onDismiss={() => setShowSettingsModal(false)}
      >
        <BottomSheetView style={contentContainerStyle} onLayout={handleContentLayout}>
          <SettingsModal threadData={threadData} navigation={navigation} />
        </BottomSheetView>
      </BottomSheetModal>
    </LinearGradient>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
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
  emoji: {
    fontSize: 156,
    textAlign: 'center',
    alignSelf: 'center',
  },
  emojiContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    color: 'white',
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 75,
    zIndex: 100,
    backgroundColor: 'black',
  },
  bigView: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: 'transparent',
  },
  messageInput: {
    backgroundColor: '#303030',
    marginRight: 5,
    borderRadius: 10,
    color: 'white',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 10,
    zIndex: 1000,
  },
  newMessageButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 10,
    backgroundColor: Colors.gray,
  },
});

export default GroupThread;
