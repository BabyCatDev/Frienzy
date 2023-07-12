import React, { useEffect, useState, useMemo } from 'react';
import {
  useWindowDimensions,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/Colors';
// import { Header } from '../../components/utils/Header';
import SearchField from '../../components/utils/SearchField';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
// import normalize from 'react-native-normalize';
import { FriendListItem } from './FriendListItem';
// import { getAllMembersInUsersGroups, getFriendsForUser } from '../../services/firebase/user';
import { AppStyles } from '../../utils/AppStyles';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const FrienzyFriends = ({ navigation, route }) => {
  const { currentGroup, groupMembers } = route.params;
  const handleNext = () => {
    navigation.navigate('AddFriend', {});
  };
  const { height } = useWindowDimensions();
  const [friendList, setFriendList] = useState([]);
  const [query, setQuery] = useState('');
  const userFriends = groupMembers;
  useEffect(() => {
    console.log(userFriends);
  }, []);

  // const filteredItems = useMemo(() => {
  //   return [...friendList];
  // }, [friendList]);

  // if (isSelecting) {
  //   return (
  //     <View style={{ flex: 1, height: '100%', marginTop: 20, alignItems: 'center' }}>
  //       <SearchField search={query} setSearch={setQuery} containerStyle={{ width: '100%' }} />
  //       <FlatList
  //         data={userFriends}
  //         keyExtractor={(item) => item}
  //         contentContainerStyle={{ height: hp(70) }}
  //         renderItem={({ item, index }) => (
  //           <FriendListItem
  //             item={item}
  //             index={index}
  //             selected={selectedFriends.includes(item)}
  //             onPressHandler={({ itemClicked }) => {
  //               console.log(itemClicked);
  //               console.log('item 44', item);
  //               if (selectedFriends.includes(itemClicked.uid)) {
  //                 setSelectedFriends(selectedFriends.filter((sf) => sf != itemClicked.uid));
  //               } else {
  //                 setSelectedFriends([...selectedFriends, itemClicked.uid]);
  //               }
  //             }}
  //             showChecks
  //           />
  //         )}
  //         ListEmptyComponent={
  //           <View
  //             style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}
  //           >
  //             <Text style={{ ...AppStyles.medium22, color: 'white' }}>{'No Friends Yet  :('}</Text>
  //           </View>
  //         }
  //       />
  //       <TouchableOpacity
  //         style={styles.addButton}
  //         onPress={() =>
  //           navigation.navigate('CreateItineraryItem', {
  //             onItemCreate: onItemCreate,
  //             currentGroup: currentGroup,
  //           })
  //         }
  //       >
  //         <Ionicon name="add-circle" size={64} color="#FB5F2D" />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <FlatList
        data={userFriends}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <FriendListItem
            item={item}
            index={index}
            onPressHandler={({ itemClicked }) => console.log(itemClicked)}
          />
        )}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
            <Text style={{ ...AppStyles.medium22, color: 'white' }}>{'No Friends Yet  :('}</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={
          () => {
            handleNext();
          }
          // navigation.navigate('CreateItineraryItem', {
          //   onItemCreate: onItemCreate,
          //   currentGroup: currentGroup,
          // })
        }
      >
        <Ionicon name="add-circle" size={64} color="#FB5F2D" />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingTop: 0,
    backgroundColor: Colors.backgroundGradient[0], // Light blue background color
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1, // Ensure the button is above the ScrollView
  },
});

export default FrienzyFriends;
