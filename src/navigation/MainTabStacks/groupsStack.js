import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// importing screens >>>>
import ContactList from '../../screens/contactList';
import GroupsList from '../../screens/groups/GroupList';
import GroupThread from '../../screens/groups/GroupThread';
import { FrienzyList }  from '../../screens/frienzyList/frienzyList';
import { NewFrienzyCreation } from '../../screens/frienzyList/NewFrienzyCreation';
import userProfile from '../../screens/profile/UserProfile';
import { useConversations } from '../../hooks/useConversations';

const GroupsStack = createNativeStackNavigator();

const GroupsStackComponent = ({ navigation }) => {
  useConversations();

  return (
    <GroupsStack.Navigator>
      <GroupsStack.Screen
        options={{ headerShown: false }}
        name="FrienzyList"
        component={FrienzyList}
      />
      <GroupsStack.Screen
        options={{ headerShown: false }}
        name="NewFrienzyCreation"
        component={NewFrienzyCreation}
      />
      <GroupsStack.Screen
        options={{ headerShown: false }}
        name="UserProfile"
        component={userProfile}
      />
      <GroupsStack.Screen
        options={{ headerShown: false }}
        name="GroupThread"
        component={GroupThread}
      />
      <GroupsStack.Screen
        options={{ headerShown: false }}
        name="Contacts"
        component={ContactList}
      />
    </GroupsStack.Navigator>
  );
};

export default GroupsStackComponent;
