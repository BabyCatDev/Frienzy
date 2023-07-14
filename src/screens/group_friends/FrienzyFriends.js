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
import { SpinnerHOC } from '../../utils/SpinnerHOC';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { FriendListItem } from './FriendListItem';
// import { getAllMembersInUsersGroups, getFriendsForUser } from '../../services/firebase/user';
import { AppStyles } from '../../utils/AppStyles';
import { removeFriendsFromGroup } from '../../services/firebase/user';
import { RemoveButton } from './RemoveButton';
import { Map } from '../map/Map';
import auth from '@react-native-firebase/auth';

export const FrienzyFriends = ({ navigation, route }) => {
  const userDetails = useSelector((state) => state.FrienzyAuth.userDetails);
  const Stack = createStackNavigator();
  const [viewMode, setViewMode] = useState('list');
  const handleToggle = (mode) => {
    setViewMode(mode);
  };
  const { currentGroup, groupMembers } = route.params;
  const userFriends = groupMembers.filter((item) => item != auth().currentUser.uid);
  const { height } = useWindowDimensions();
  const [friendList, setFriendList] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);
  useEffect(() => setFriendList(userFriends), { userFriends });
  const handleNext = () => {
    console.log('=======cur===', currentGroup);
    navigation.navigate('AddFriend', { currentGroup: currentGroup });
  };
  const removeSelectedFriends = () => {
    setLoading(true);
    if (groupMembers[0] == auth().currentUser.uid) {
      removeFriendsFromGroup(currentGroup, selectedItems);
      const updated_result = friendList.filter((item) => !selectedItems.includes(item));
      setFriendList(updated_result);
    }
    setLoading(false);
  };

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
  const WrappedFrienzyFriends = SpinnerHOC();
  return (
    <View style={styles.container}>
      <View
        style={[
          {
            position: 'absolute',
            zIndex: 1,
            top: 20,
            left: 0,
            width: '100%',
            flexDirection: 'row',
            margin: 5,
            paddingHorizontal: 10,
            paddingVertical: 10,
            justifyContent: 'center',
          },
          viewMode === 'list' ? { position: 'relative' } : null,
        ]}
      >
        <View style={styles.toggleWrapper}>
          <TouchableOpacity
            onPress={() => handleToggle('list')}
            style={[
              styles.toggleButton,
              {
                backgroundColor: viewMode === 'list' ? '#FB5F2D' : 'transparent',
              },
            ]}
          >
            <Text style={{ color: viewMode === 'list' ? 'white' : 'black', fontWeight: 'bold' }}>
              List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleToggle('map')}
            style={[
              styles.toggleButton,
              {
                backgroundColor: viewMode === 'map' ? '#FB5F2D' : 'transparent',
              },
            ]}
          >
            <Text style={{ color: viewMode === 'map' ? 'white' : 'black', fontWeight: 'bold' }}>
              Map
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {viewMode === 'list' ? (
        <FlatList
          data={friendList}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => (
            <FriendListItem
              item={item}
              index={index}
              onPressHandler={({ itemClicked }) => {
                if (selectedItems.indexOf(item) === -1) {
                  setSelectedItems([...selectedItems, item]);
                } else {
                  // Deselect the item
                  setSelectedItems(selectedItems.filter((i) => i !== item));
                }
              }}
              selected={selectedItems.includes(item)}
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
      ) : (
        <Map _currentGroup={currentGroup} />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          handleNext();
        }}
      >
        <Ionicon name="add-circle" size={64} color="#FB5F2D" />
      </TouchableOpacity>
      <RemoveButton
        isDisabled={selectedItems.length == 0 ? true : false}
        onPress={() => {
          removeSelectedFriends();
        }}
        isLoading={loading}
      />
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
  map: {
    flex: 1,
    width: '100%',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1, // Ensure the button is above the ScrollView
  },

  toggleWrapper: {
    backgroundColor: '#EBEBEB',
    flexDirection: 'row',
    borderRadius: 43,
  },
  toggleButton: {
    borderRadius: 43,
    padding: 5,
    width: 50,
    alignItems: 'center',
  },
});

export default FrienzyFriends;
