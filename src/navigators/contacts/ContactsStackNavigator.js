import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ContactList from "../../screens/contact-list/ContactList";
const ContactsStack = createStackNavigator();

const ContactsStackNavigator = () => {

  return (
    <ContactsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ContactsStack.Screen name="Contacts" component={ContactList} />
    </ContactsStack.Navigator>
  );
};

export default ContactsStackNavigator;
