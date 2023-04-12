import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import ContactList from "../../screens/contact-list/ContactList";
const ContactsStack = createStackNavigator();

const ContactsStackNavigator = () => {
  const { isFirstLaunch } = useSelector((state) => state.auth);

  return (
    <ContactsStack.Navigator
      // initialRouteName={
      // isFirstLaunch
      // ? ScreenNames.AuthStack.ONBOARDING
      // ScreenNames.AuthStack.SIGN_IN
      // "SplashScreen"
      // }
      screenOptions={{
        headerShown: false,
      }}
    >
      <ContactsStack.Screen name="Contacts" component={ContactList} />
    </ContactsStack.Navigator>
  );
};

export default ContactsStackNavigator;
