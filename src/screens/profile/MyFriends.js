import React, { useEffect, useState, useMemo } from 'react';
import { useWindowDimensions, Text, FlatList, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/Colors';
import { Header } from '../../components/Header';
import SearchField from '../../components/SearchField';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import normalize from 'react-native-normalize';
import FriendListItem from './FriendListItem';
import { getAllMembersInUsersGroups, getFriendsForUser } from '../../services/firebase/user';
import { AppStyles } from '../../utils/AppStyles';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const MyFriends = ({ navigation, setSelectedFriends, selectedFriends, isSelecting }) => {
  const { height } = useWindowDimensions();
  const [friendList, setFriendList] = useState([]);
  const [query, setQuery] = useState('');
  const userFriends = useSelector((state) => state.FrienzyAuth.userFriends);

  useEffect(() => {
    console.log(userFriends);
  }, []);

  // const filteredItems = useMemo(() => {
  //   return [...friendList];
  // }, [friendList]);

  if (isSelecting) {
    return (
      <View style={{ flex: 1, height: '100%', marginTop: 20, alignItems: 'center' }}>
        <SearchField search={query} setSearch={setQuery} containerStyle={{ width: '100%' }} />
        <FlatList
          data={userFriends}
          keyExtractor={(item) => item}
          contentContainerStyle={{ height: hp(70) }}
          renderItem={({ item, index }) => (
            <FriendListItem
              item={item}
              index={index}
              selected={selectedFriends.includes(item)}
              onPressHandler={({ itemClicked }) => {
                console.log(itemClicked);
                if (selectedFriends.includes(itemClicked)) {
                  setSelectedFriends(selectedFriends.filter((sf) => sf != itemClicked));
                } else {
                  setSelectedFriends([...selectedFriends, itemClicked]);
                }
              }}
              showChecks
            />
          )}
          ListEmptyComponent={
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}
            >
              <Text style={{ ...AppStyles.medium22, color: 'white' }}>{'No Friends Yet  :('}</Text>
            </View>
          }
        />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={Colors.backgroundGradient}
      style={{ flex: 1, paddingTop: height * 0.08, paddingHorizontal: 20 }}
    >
      <View>
        <Header
          title={'My Friends'}
          navigation={navigation}
          containerStyle={{ marginBottom: 20 }}
        />
        <SearchField search={query} setSearch={setQuery} />
      </View>
      <FlatList
        data={userFriends}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <FriendListItem
            item={item}
            index={index}
            onPress={({ itemClicked }) => console.log(itemClicked)}
          />
        )}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
            <Text style={{ ...AppStyles.medium22, color: 'white' }}>{'No Friends Yet  :('}</Text>
          </View>
        }
      />
    </LinearGradient>
  );
};

export default MyFriends;
