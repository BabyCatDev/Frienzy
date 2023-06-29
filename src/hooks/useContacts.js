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
      // Android permission request code remains the same
    } else if (Platform.OS === 'ios') {
      const iOSContactPermission = await Contacts.checkPermission();
      if (iOSContactPermission === 'denied') {
        console.log('iOS contact permission denied');
        setLoading(false);
        return;
      } else if (iOSContactPermission === 'undefined') {
        const iOSContactAuthorization = await Contacts.requestPermission();
        if (iOSContactAuthorization !== 'authorized') {
          console.log('iOS contact permission not authorized');
          setLoading(false);
          return;
        }
      }
    }
  
    try {
      const contacts = await Contacts?.getAll();
      const result = [];
  
      for (let contact of contacts) {
        if (contact.phoneNumbers.length === 0) continue;
        const num = contact.phoneNumbers[0].number.replace(/\D/g, '');
        const numWithCC = num.length === 11 ? `+${num}` : `+1${num}`;
        const user = phone2UserIndex[numWithCC] ? allUsers[phone2UserIndex[numWithCC]] : null;
        if (user == null || !friends.includes(user?.[0]?.uid)) {
          result.push(contact);
        }
      }
  
      // Sort contacts alphabetically by first name
      result.sort((a, b) => {
        const nameA = a.givenName?.toUpperCase() ?? '';
        const nameB = b.givenName?.toUpperCase() ?? '';
        return nameA.localeCompare(nameB);
      });
  
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
