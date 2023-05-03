import Ionicon from "react-native-vector-icons/Ionicons";
import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import { Pressable, View, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import firestore from "@react-native-firebase/firestore";
import { Composer, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat'
import { useThread } from "../../hooks/useThread";
import { Colors } from "../../utils/Colors";
import MessageCard from "./MessageCard";
import LinearGradient from "react-native-linear-gradient";
import { Header } from "../profile/Header";
import { sendMessage } from "../../services/firebase/conversations";

const GroupThread = ({ navigation, route }) => {
    const { threadId, name } = route.params
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const { thread } = useThread(threadId);
    const userDetails = useSelector(state => state.FrienzyAuth.userDetails);

    const renderItem = ({ item, prev, next }) => {
        return <MessageCard item={item} prev={prev} next={next} />
    }

    useEffect(() => {
        console.log(thread)
        async function setUp() {
          await firestore()
          .collection("groups")
          .doc(threadId)
          .update({
            [`recentMessage.readBy.${userDetails.uid}`]: true
          })
        }
        setUp()
    }, [])

    const handleSendMessage = async () => {

      const newMessage = {
        text: message,
        sentBy: userDetails.uid,
        sentAt: firestore.FieldValue.serverTimestamp()
      }

      setLoading(true);
      setMessage(null);
      await sendMessage(newMessage, threadId, userDetails);
      setLoading(false);
    };


    const renderSend = (props) => {
      return (
        <Send {...props} style={styles.sendBtn}>
            <LinearGradient colors={Colors.mainGradient} style={styles.sendBtnContainer}>
              {loading ? (
                <ActivityIndicator color={"#1A1822"}/>
              ) : (
                <Ionicon name="arrow-up-outline" size={20} color={"white"} />
              )}
            </LinearGradient>
        </Send>
      )
    }

    const renderActions = (props) => {
        console.log("action props", props)
        return (
            <View style={styles.buttonRow}>
                <Pressable style={styles.newMessageButton} onPress={() => console.log("location pressed")}>
                   <Ionicon name="locate-outline" size={20} color={"white"} />
                </Pressable>
            </View>
        )
    }

    const renderComposer = (props) => {
        return (
            <Composer textInputStyle={{color: "white"}} {...props}  />
        )
    }

    const renderInputToolbar = (props) => {
      return (
          <InputToolbar 
            containerStyle={styles.messageContainer} 
            {...props} 
          />
      )
    }


    // const onSend = useCallback(async (messages = []) => {
    //     setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    // }, [])

    return (
      <LinearGradient colors={Colors.backgroundGradient} style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <Header navigation={navigation} title={name} containerStyle={{marginHorizontal: 20, height: 40, alignItems: "center"}} />
          <GiftedChat
                messages={thread}
                onSend={async () => {
                  await handleSendMessage()
                }}
                renderBubble={({ currentMessage, nextMessage, previousMessage }) => {
                  return renderItem({item: currentMessage, prev: previousMessage ?? null, next: nextMessage ?? null})
                }}
                text={message}
                onInputTextChanged={text => setMessage(text)}
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
      </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    color: "white",
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },
  navBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    height: 75,
    zIndex: 100,
    backgroundColor: "black"
  },
  bigView: {
    justifyContent: "flex-start",
    flex: 1,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "transparent"
  },
  messageInput: {
    backgroundColor: "#303030",
    marginRight: 5,
    borderRadius: 10,
    color: "white",
  },
  sendBtnContainer: {
    borderRadius: 10,
    height: 30,
    width: 30,
    justifyContent: "center", 
    alignItems: "center",
    padding: 5, 
  },
  sendBtn: {
    height: 30,
    width: 30,
    borderRadius: 10,
    justifyContent: "center", 
    alignItems: "center",
    padding: 5, 
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical: 10,
    zIndex: 1000,
  },
  newMessageButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    borderRadius: 10,
    backgroundColor: Colors.gray,
  },

})


export default GroupThread;
