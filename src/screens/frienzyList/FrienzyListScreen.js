import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { AppStyles } from '../../utils/AppStyles';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getGroupsForUser } from '../../services/firebase/user';
import { getGroupById } from '../../services/firebase/conversations';
import { formatDate } from '../../utils/FormatDate';

export const FrienzyList = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Active');

  const userDetails = useSelector((state) => state.FrienzyAuth.userDetails);
  const [groupItems, setGroupItems] = useState([]);
  const [activatedGroup, setActivatedGroup] = useState([]);
  const [compeletedGroup, setCompeletedGroup] = useState([]);

  useEffect(() => {
    async function getUserGroups() {
      const tempDetails = await getGroupsForUser(userDetails.groups);
      const formattedData = tempDetails.map((td) => {
        return {
          label: td.name,
          value: td.id,
          description: td.description,
          members: td.members,
          startDate: td.startDate,
          endDate: td.endDate,
          isCompleted: td.isCompleted,
        };
      });
      console.log('formatted data frienzyList', formattedData);
      setGroupItems(formattedData);
    }
    getUserGroups();
  }, [userDetails.groups]);
  useEffect(() => {
    let searchResults1 = groupItems.filter((item) => item.isCompleted == true);
    setCompeletedGroup(searchResults1);
    let searchResults2 = groupItems.filter((item) => item.isCompleted == false);
    console.log('----------', searchResults2);
    setActivatedGroup(searchResults2);

    // Rest of your code here
  }, [groupItems]);

  const fetchGroupInfo = async (groupId) => {
    const groupInfo = await getGroupById(groupId);
    console.log('groupInfo', groupInfo);
    navigation.navigate('ActiveFrienzy', { groupInfo: groupInfo });
    return groupInfo;

    //navigate to groupFrienzy
    // pass in groupInfo
    //
  };

  groupItems.map((groupItem) => {
    if (!groupItem.startDate || !groupItem.endDate) {
      return null; // Skip over items with undefined start or end dates
    }
    const startDate = new Date(groupItem.startDate.seconds * 1000);
    const endDate = new Date(groupItem.endDate.seconds * 1000);

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
  });

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const handleAddButtonPressed = () => {
    navigation.navigate('NewFrienzyCreation');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={{ ...AppStyles.semibold40 }}>Frienzy</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => {
            navigation.navigate('UserProfile');
          }}
        >
          <Ionicon name="person-circle" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Active' && styles.activeTab]}
          onPress={() => handleTabPress('Active')}
        >
          <Text style={[AppStyles.semibold20, activeTab === 'Active' && AppStyles.semibold22]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}
          onPress={() => handleTabPress('Completed')}
        >
          <Text style={[AppStyles.semibold20, activeTab === 'Completed' && AppStyles.semibold22]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.frienzyCardsContainer}>
        {activeTab == 'Active'
          ? activatedGroup.map((groupItem) => (
              <TouchableOpacity
                key={groupItem.value}
                style={styles.frienzyContainer}
                onPress={() => fetchGroupInfo(groupItem.value)}
              >
                <View style={styles.frienzyContentContainer}>
                  <View style={styles.frienzyTextContainer}>
                    <Text style={{ ...AppStyles.semibold17 }}>{groupItem.label}</Text>
                    <Text style={{ ...AppStyles.medium13 }}>{groupItem.description}</Text>
                  </View>
                  <View style={styles.detailsContainer}>
                    <View>
                      <Text style={{ ...AppStyles.semibold13 }}>
                        {groupItem.startDate &&
                          groupItem.endDate &&
                          `${formatDate(
                            new Date(groupItem.startDate.seconds * 1000)
                          )} - ${formatDate(new Date(groupItem.endDate.seconds * 1000))}`}
                      </Text>
                      <Text style={{ ...AppStyles.medium13, textAlign: 'right', marginTop: 10 }}>
                        {groupItem.members.length} friends
                      </Text>
                    </View>
                    {/* Render other conversation details */}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          : compeletedGroup.map((groupItem) => (
              <TouchableOpacity
                key={groupItem.value}
                style={styles.frienzyContainer}
                onPress={() => fetchGroupInfo(groupItem.value)}
              >
                <View style={styles.frienzyContentContainer}>
                  <View style={styles.frienzyTextContainer}>
                    <Text style={{ ...AppStyles.semibold17 }}>{groupItem.label}</Text>
                    <Text style={{ ...AppStyles.medium13 }}>{groupItem.description}</Text>
                  </View>
                  <View style={styles.detailsContainer}>
                    <View>
                      <Text style={{ ...AppStyles.semibold13 }}>
                        {groupItem.startDate &&
                          groupItem.endDate &&
                          `${formatDate(
                            new Date(groupItem.startDate.seconds * 1000)
                          )} - ${formatDate(new Date(groupItem.endDate.seconds * 1000))}`}
                      </Text>
                      <Text style={{ ...AppStyles.medium13, textAlign: 'right', marginTop: 10 }}>
                        {groupItem.members.length} friends
                      </Text>
                    </View>
                    {/* Render other conversation details */}
                  </View>
                </View>
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
  frienzyContentContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  frienzyTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  startDate: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'right',
  },
  endDate: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'right',
    marginTop: 4,
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
    borderBottomColor: '#FB5F2D',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  activeTabText: {
    color: '#FB5F2D',
  },
  frienzyCardsContainer: {
    padding: 10,
    paddingHorizontal: 16,
    paddingBottom: 80, // Adjust paddingBottom to make room for the "+" button
  },
  frienzyContainer: {
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
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
    zIndex: 1, // Ensure the button is above the ScrollViee button's size and shape
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  frienzyContainer: {
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
    padding: 16,
    marginBottom: 16,
    marginLeft: 8,
    marginRight: 8,
  },
  frienzyContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
