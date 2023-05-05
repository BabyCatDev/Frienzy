import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import normalize from 'react-native-normalize';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { AppStyles } from '../../utils/AppStyles';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/Colors';

const GroupListItem = ({ item, index }) => {
  const navigation = useNavigation();
  const [readByUser, setReadByUser] = useState(false);

  useEffect(() => {
    setReadByUser(item.recentMessage.readBy[auth().currentUser.uid]);
  }, [item]);

  const getInitials = (name) => {
    const fullName = name;
    return fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('');
  };

  const weight = () => {
    if (!readByUser) {
      return 'bold';
    } else {
      return 'normal';
    }
  };

  const color = () => {
    if (!readByUser) {
      return 'white';
    } else {
      return 'gray';
    }
  };

  const UnreadDot = () => {
    if (!readByUser) {
      return (
        <LinearGradient style={styles.unreadDot} colors={Colors.mainGradient}></LinearGradient>
      );
    } else {
      return null;
    }
  };

  const formatDate = (date) => {
    let rawdate = new Date(date.seconds * 1000);
    dayjs.extend(calendar);
    return dayjs(rawdate).calendar(dayjs(), {
      sameDay: 'h:mm A', // The same day ( Today at 2:30 AM )
      nextDay: '[Tomorrow]', // The next day ( Tomorrow at 2:30 AM )
      nextWeek: 'dddd', // The next week ( Sunday at 2:30 AM )
      lastDay: '[Yesterday]', // The day before ( Yesterday at 2:30 AM )
      lastWeek: 'dddd', // Last week ( Last Monday at 2:30 AM )
      sameElse: 'M/D/YY', // Everything else ( 7/10/2011 )
    });
    //return dayjs().calendar(dayjs(rawdate))
    //return dayjs(rawdate).fromNow()
  };

  const navigateToThread = async () => {
    navigation.push('GroupThread', { threadId: item.id, name: item.name });
  };

  return (
    <Pressable
      style={{
        ...styles.container,
        marginTop: !index ? normalize(6.56) : 0,
        borderTopWidth: index ? 1.5 : 0,
        borderTopColor: index ? Colors.gray : 'transparent',
      }}
      onPress={() => navigateToThread()}
    >
      <View style={AppStyles.contactImageContainer}>
        {item?.pic ? (
          <Image resizeMode="cover" source={{ uri: item?.pic }} style={AppStyles.contactImage} />
        ) : (
          <Text style={AppStyles.semibold25}>{getInitials(item.name).substr(0, 2)}</Text>
        )}
      </View>
      <View style={styles.messageDetails}>
        <View style={styles.nameTimeRow}>
          <Text style={[AppStyles.semibold17, { fontWeight: weight() }]}>{item?.name}</Text>
          <Text style={[AppStyles.medium13, { fontWeight: weight() }]}>
            {formatDate(item.modifiedAt)}
          </Text>
        </View>
        <View style={styles.songDotRow}>
          <View style={styles.songData}>
            <Text
              numberOfLines={2}
              style={[AppStyles.medium13, { fontWeight: weight(), color: color() }]}
            >
              {item.recentMessage.text}
            </Text>
          </View>
          <UnreadDot />
        </View>
      </View>
    </Pressable>
  );
};

export default GroupListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: normalize(18.44),
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  songDotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songData: {
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  messageDetails: {
    flex: 1,
  },
  nameTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    color: 'white',
  },
  date: {
    color: 'white',
  },
});
