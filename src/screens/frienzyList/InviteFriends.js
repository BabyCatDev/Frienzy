import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Clipboard, Platform, SectionList } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { Colors } from '../../utils/Colors';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Header } from '../../components/Header';
import SearchField from '../../components/SearchField';
import { FriendListItem } from '../profile/FriendListItem';
import { AppStyles } from '../../utils/AppStyles';
import { createNewGroup, getPreDefinedGroup } from '../../services/firebase/conversations';
import { useNavigation } from '@react-navigation/native';
import { useContacts } from '../../hooks/useContacts';
import ContactItem from '../contactList/ContactItem';
import { useFriends } from '../../hooks/useFriends';
import { MainButton } from '../../components/MainButton';
import { sendInviteSMSToUsers } from '../../services/twillioService';
import { getMobileNumber } from '../../utils/helper';

export const InviteFriends = ({ route }) => {
  const [query, setQuery] = useState('');
  const navigation = useNavigation();
  const userFriends = useSelector((state) => state.FrienzyAuth.userFriends);
  const userDetails = useSelector((state) => state.FrienzyAuth.userDetails);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { photo, title, description, location, startDate, endDate } = route.params;  
  const { data: friends, isLoading } = useFriends(userFriends);
  const { contactsToAdd, contactsLoading } = useContacts(userFriends);
  const newFbGroupRef = getPreDefinedGroup();

  console.log('photo', photo);
  console.log('title', title);
  console.log('description', description);
  console.log('startDate', startDate);
  console.log('endDate', endDate);
  console.log('location', location);
  

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
  const toggleContactSelection = (item) => {
    if (selectedContacts.includes(item)) {
      setSelectedContacts(selectedContacts.filter((item) => item.recordID !== item.recordID));
    } else {
      setSelectedContacts([...selectedContacts, item]);
    }
  };


  

  const handleCreatePress = async () => {
    try {
      setLoading(true);
      await createNewGroup({
        group: newFbGroupRef,
        name: title,
        pic:  photo,
        members: selectedFriends,
        location: location,
        description: description,
        startDate: startDate,
        endDate: endDate,
      });
      
      const phoneNumbers = [
        ...selectedContacts.map(item => ({
          name: item.displayName,
          phone: getMobileNumber(item)
        })),
        ...friends?.filter(
          item => selectedFriends.includes(item.uid)
        ).map(
          item => ({
            name: item.name,
            phone: item.phone, 
          })
        )
      ];
      await sendInviteSMSToUsers(
        userDetails.name,
        newFbGroupRef.id,
        phoneNumbers
      );
      setLoading(false);
      navigation.navigate('FrienzyList');
    } catch ( error ) {
      setLoading(false);
      console.log("handleCreatePress error:", error);
    }    
  };

  const handleCopyLink = () => {
    const invitationLink = `https://www.frienzy.io/#${newFbGroupRef.id}`; // Replace with your actual invitation link
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

  const suggestions = [{
      title: "Friends on Frienzy",
      data: userFriends ?? []
    }, {
      title: "From your contactlist",
      data: contactsToAdd 
    },
  ];

  return (
    <View style={{ flex: 1, paddingHorizontal: 8 }}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicon name="arrow-back" size={24} color="black" />
      </Pressable>
      <Text style={styles.headerText}>Invite Friends</Text>
      <View style={styles.container}>
        <SearchField search={query} setSearch={setQuery} containerStyle={{ width: '100%' }} />
        <SectionList
          sections={suggestions}
          keyExtractor={(item, index) => item.recordID !== undefined ? item.recordID : item}
          renderItem={({item, index}) => (
            item.recordID !== undefined ? (
              <ContactItem
                item={item}
                index={index}
                onPress={({ item }) => toggleContactSelection(item)}
                check={selectedContacts.map(item => item.recordID).includes(item.recordID)}
                />
            ) : (
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
            )
          )}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
              <Text style={{ ...AppStyles.medium22, color: 'gray' }}>No Friends to Invite</Text>
            </View>
          }
        />
      </View>
      <MainButton
        title="Create Frienzy"
        isLoading={loading}
        isDisabled={loading}
        onPress={async () => handleCreatePress()}
        containerStyle={{
          alignSelf: 'center',
        }}
      />
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
    marginVertical: 6,
    maxHeight: 7 * 100, // Adjust the height as per your requirement
    paddingHorizontal: 8
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
  sectionHeader: {
    paddingHorizontal: 10,
    paddingTop: 15,
    fontSize: 16,
    fontWeight: 'bold'
  },
  createButton: {
      height: 40,
      backgroundColor: '#FB5F2D',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
  },
  createButtonText: {
      fontSize: 16,
      color: 'white',
  },
});
