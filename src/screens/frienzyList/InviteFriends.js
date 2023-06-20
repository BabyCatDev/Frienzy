import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Clipboard, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { Colors } from '../../utils/Colors';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Header } from '../../components/Header';
import SearchField from '../../components/SearchField';
import { FriendListItem } from '../profile/FriendListItem';
import { AppStyles } from '../../utils/AppStyles';
import { createNewGroup } from '../../services/firebase/conversations';
import { useNavigation } from '@react-navigation/native';

export const InviteFriends = ({ route }) => {
  const [query, setQuery] = useState('');
  const navigation = useNavigation();
  const userFriends = useSelector((state) => state.FrienzyAuth.userFriends);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const { photo, title, description, location, startDate, endDate } = route.params;

  console.log('photo', photo);
    console.log('title', title);
    console.log('description', description);
    console.log('startDate', startDate);
    console.log('endDate', endDate);
    console.log('location', location);
    console.log('selected', selectedFriends);
    

  const handleInvite = (friend) => {
    // Implement your invite logic here
    console.log('Inviting friend:', friend);
  };

  const toggleFriendSelection = (friendId) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter((id) => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };


  

  const handleCreatePress = async () => {
    const { id: groupId } = await createNewGroup({
        name: title,
        pic:  photo,
        members: selectedFriends,
        location: location,
        description: description,
        startDate: startDate,
        endDate: endDate,
        });
    navigation.navigate('FrienzyList');
    };

  const handleCopyLink = () => {
    const invitationLink = 'https://example.com/invitation'; // Replace with your actual invitation link
    Clipboard.setString(invitationLink);
    console.log('Invitation link copied to clipboard:', invitationLink);
  
    // Show a toast message to inform the user
    Toast.show({
      type: 'success',
      text1: 'Invitation link copied to clipboard',
      visibilityTime: 2000, // Adjust the duration as per your preference
      autoHide: true,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicon name="arrow-back" size={24} color="black" />
      </Pressable>
      <Text style={styles.headerText}>Invite Friends</Text>
      <View style={styles.container}>
        <FlatList
          data={userFriends}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => (
            <FriendListItem
              item={item}
              index={index}
              showChecks={true}
              selected={selectedFriends.includes(item)}
              onPressHandler={({ itemClicked }) => toggleFriendSelection(itemClicked)}
              actionButton={
                <Pressable onPress={() => handleInvite(item)}>
                  <Text style={{ color: Colors.primary }}>Invite</Text>
                </Pressable>
              }
              containerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
            />
          )}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
              <Text style={{ ...AppStyles.medium22, color: 'gray' }}>No Friends to Invite</Text>
            </View>
          }
        />
      </View>
      <Pressable style={styles.createButton} onPress={handleCreatePress}>
        <Text style={styles.createButtonText}>Create Frienzy</Text>
      </Pressable>
      <Pressable style={styles.copyButton} onPress={handleCopyLink}>
        <Ionicon name="copy-outline" size={24} color="black" />
        <Text style={styles.copyButtonText}>Copy Invitation Link</Text>
      </Pressable>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    marginTop: 25,
    top: 10,
    left: 10,
    zIndex: 1,
  },
  container: {
    flex: 1,
    maxHeight: 7 * 100, // Adjust the height as per your requirement
  },
  copyButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 80,
  },
  copyButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
