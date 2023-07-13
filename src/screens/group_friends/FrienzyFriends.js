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
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import normalize from 'react-native-normalize';
import { FriendListItem } from './FriendListItem';
// import { getAllMembersInUsersGroups, getFriendsForUser } from '../../services/firebase/user';
import { AppStyles } from '../../utils/AppStyles';
// import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Map } from '../map/Map';

export const FrienzyFriends = ({ navigation, route }) => {
  const Stack = createStackNavigator();
  const [viewMode, setViewMode] = useState('list');
  const handleToggle = (mode) => {
    setViewMode(mode);
  };
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
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}
            >
              <Text style={{ ...AppStyles.medium22, color: 'white' }}>{'No Friends Yet  :('}</Text>
            </View>
          }
        />
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Map"
            component={Map}
            initialParams={{ currentGroup: currentGroup }}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
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
