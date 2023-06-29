import { Platform, PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useContacts = (friends) => {
  const [contactsToAdd, setContactsAdd] = useState([]);
  const [loading, setLoading] = useState(false);
  const allUsers = useSelector((state) => state.FrienzyData.allUsers);
  const phone2UserIndex = useMemo(() => {
    const map = {};
    allUsers && allUsers.forEach((u, index) => {
      map[u.phone] = index;
    });
    return map;
  }, [allUsers]);

  const loadContacts = useCallback( async () => {
    setLoading(true);
    setContactsAdd([]);
    if (Platform.OS === 'android') {
      const andoidContactPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Permission',
          message: 'This app would like to view your contacts.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (andoidContactPermission !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("android contact permission granted");
      }
    }
  
    try {
      const contacts = await Contacts?.getAll();
      const result = [];

      for (let contact of contacts) {
        if (contact.phoneNumbers.length == 0)
          continue;
        const num = contact.phoneNumbers[0].number.replace(/\D/g, '');
        const numWithCC = num.length == 11 ? `+${num}` : `+1${num}`;
        const user = phone2UserIndex[numWithCC] ? allUsers[phone2UserIndex[numWithCC]] : null;
        if (user == null || !friends.includes(user[0].uid)) {
          result.push(contact);
        }
      }
      setContactsAdd(result);
    } catch (error) {
      console.log("useContacts error: ", error);
    }
    setLoading(false);
  }, [setLoading, setContactsAdd]);

  useEffect(() => {
    loadContacts();
  }, []);

  return {
    contactsLoading: loading,
    contactsToAdd
  }
}
