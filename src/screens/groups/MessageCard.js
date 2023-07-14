import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/Colors';
import { useUser } from '../../hooks/useUser';
import { AppStyles } from '../../utils/AppStyles';
import normalize from 'react-native-normalize';

const MessageCard = ({ item, prev, next }) => {
  const getInitials = (name) => {
    const fullName = name;
    return fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('');
  };
  if (item.sentBy == 'frienzy')
    return (
      <View
        style={[
          styles.container,
          {
            flexDirection: 'row',
            marginBottom: 10,
          },
        ]}
      >
        {
          <View
            style={[
              AppStyles.messageImageContainer,
              {
                marginRight: normalize(10),
                marginLeft: 0,
              },
            ]}
          >
            <Text style={AppStyles.semibold25}>{getInitials('Frienzy').substr(0, 2)}</Text>
          </View>
        }
        <View style={styles.messageContainer}>
          <Text
            style={[
              AppStyles.medium13,
              {
                fontSize: 11,
                marginLeft: isCurrentUser ? 0 : 5,
                marginRight: isCurrentUser ? 5 : 0,
                textAlign: isCurrentUser ? 'right' : 'left',
              },
            ]}
          >
            Frienzy
          </Text>
          <View style={styles.message}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        </View>
      </View>
    );
  const { data: userData, isLoading } = useUser(item.sentBy);
  console.log('messages sender----', item);

  const isCurrentUser = item.sentBy === auth().currentUser.uid;
  const isSameAsNextUser = next == null ? false : next.sentBy === item.sentBy;
  const isSameAsLastUser = prev == null ? false : prev.sentBy === item.sentBy;

  if (isLoading) return <></>;

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: isCurrentUser ? 'row-reverse' : 'row',
          marginBottom: isSameAsNextUser ? 2 : 10,
        },
      ]}
    >
      {isSameAsNextUser ? (
        <View
          style={{
            width: normalize(30),
            height: normalize(30),
            marginRight: isCurrentUser ? 0 : normalize(10),
            marginLeft: isCurrentUser ? normalize(10) : 0,
          }}
        ></View>
      ) : (
        <View
          style={[
            AppStyles.messageImageContainer,
            {
              marginRight: isCurrentUser ? 0 : normalize(10),
              marginLeft: isCurrentUser ? normalize(10) : 0,
            },
          ]}
        >
          {userData['profilePic'] ? (
            <Image
              resizeMode="cover"
              source={{ uri: userData.profilePic }}
              style={AppStyles.messageImage}
            />
          ) : (
            <Text style={AppStyles.semibold25}>{getInitials(userData.name).substr(0, 2)}</Text>
          )}
        </View>
      )}
      <View style={styles.messageContainer}>
        {isSameAsLastUser ? null : (
          <Text
            style={[
              AppStyles.medium13,
              {
                fontSize: 11,
                marginLeft: isCurrentUser ? 0 : 5,
                marginRight: isCurrentUser ? 5 : 0,
                textAlign: isCurrentUser ? 'right' : 'left',
              },
            ]}
          >
            {isCurrentUser ? 'You' : userData.name}
          </Text>
        )}
        {isCurrentUser ? (
          <LinearGradient angle={135} useAngle colors={Colors.mainGradient} style={styles.message}>
            <Text style={styles.messageText}>{item.text}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.message}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MessageCard;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    maxWidth: '75%',
  },
  messageContainer: {},
  message: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#282828',
  },
  albumImageContainer: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  songCover: {
    height: '100%',
    width: '100%',
    borderRadius: 8,
  },
  songInfo: {
    marginHorizontal: 10,
    maxWidth: '70%',
  },
  messageText: {
    color: 'white',
  },
  songArtist: {
    color: 'gray',
    maxWidth: '100%',
  },
  progressBar: {
    marginVertical: 10,
  },
  sideButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  playStopButton: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  addButton: {
    justifyContent: 'center',
  },
});
