import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// importing screens >>>>
import ContactList from '../../screens/contactList';
import GroupsList from '../../screens/groups/GroupList';
import GroupThread from '../../screens/groups/GroupThread';
import { useConversations } from '../../hooks/useConversations';

const GroupsStack = createNativeStackNavigator();

const GroupsStackComponent = ({ navigation }) => {
  useConversations();

  return (
    <GroupsStack.Navigator>
      <GroupsStack.Screen
        options={{ headerShown: false }}
        name="GroupsList"
        component={GroupsList}
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
