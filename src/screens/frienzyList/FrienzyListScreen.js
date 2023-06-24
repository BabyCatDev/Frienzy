import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getGroupsForUser } from '../../services/firebase/user';
import { getGroupById } from '../../services/firebase/conversations';

export const FrienzyList = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Active');


  const userDetails = useSelector((state) => state.FrienzyAuth.userDetails);
  const [groupItems, setGroupItems] = useState([]);

  useEffect(() => {
    async function getUserGroups() {
      const tempDetails = await getGroupsForUser(userDetails.groups);
      const formattedData = tempDetails.map((td) => {
        return { label: td.name, value: td.id, description: td.description, members: td.members, startDate: td.startDate, endDate: td.endDate };
      });
      console.log('formatted data frienzyList', formattedData);
      setGroupItems(formattedData);
    }
    getUserGroups();
  }, [userDetails.groups]);

  const handleFrienzyPress = (frienzyId) => {

    navigation.push('GroupThread', { threadId: frienzyId });

  };

  const fetchGroupInfo = async (groupId) => {
    const groupInfo = await getGroupById(groupId);
    console.log('groupInfo', groupInfo);
    navigation.navigate('ActiveFrienzy', { groupInfo: groupInfo })
    return groupInfo;

    //navigate to groupFrienzy
    // pass in groupInfo
    // 
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const handleAddButtonPressed = () => {
    navigation.navigate('NewFrienzyCreation');
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Frienzy</Text>
        <TouchableOpacity style={styles.profileButton} onPress={() => { navigation.navigate("UserProfile") }}>
          <Ionicon name="person-circle" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Active' && styles.activeTab]}
          onPress={() => handleTabPress('Active')}
        >
          <Text style={[styles.tabText, activeTab === 'Active' && styles.activeTabText]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}
          onPress={() => handleTabPress('Completed')}
        >
          <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.frienzyCardsContainer}>
        {groupItems.map((groupItem) => (
          <TouchableOpacity
            key={groupItem.value}
            style={styles.frienzyContainer}
            onPress={() => fetchGroupInfo(groupItem.value)}
          >
            <Text style={styles.frienzyTitle}>{groupItem.label}</Text>
            <Text style={styles.frienzyDescription}>{groupItem.description}</Text>
            {/* Render other conversation details */}
          </TouchableOpacity>
        ))}
      </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddButtonPressed()}>
          <Ionicon name="add-circle" size={64} color="#FB5F2D" />
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  headerContainer: {
    marginTop: Platform.OS === 'ios' ? 8 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileButton: {
    marginLeft: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginRight: 8,
  },
  activeTab: {
    borderBottomColor: 'darkorange',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  activeTabText: {
    color: 'black',
  },
  frienzyCardsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Adjust paddingBottom to make room for the "+" button
  },
  frienzyContainer: {
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    padding: 16,
    marginBottom: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  frienzyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    zIndex: 1, // Ensure the button is above the ScrollView
  },
});

