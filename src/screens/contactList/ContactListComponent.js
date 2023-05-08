import React from 'react';
import { View } from 'react-native';
import { AppStyles } from '../../utils/AppStyles';
import ContactItem from './ContactItem';

const ContactListComponent = ({ filteredItems }) => {
  return (
    <View
      style={{
        ...AppStyles.listContainer,
        justifyContent: filteredItems?.length ? 'flex-start' : 'center',
      }}
    >
      {filteredItems?.length
        ? filteredItems.map((contact, index) => {
            return (
              <ContactItem
                key={index}
                item={contact}
                index={index}
                onPress={({ item }) => {
                  //   if (selectedContactList[item.recordID] == true) {
                  //     setSelectedContactList((prevState) => ({
                  //       ...prevState,
                  //       [item.recordID]: false,
                  //     }));
                  //     AsyncStorage.setItem(
                  //       'selectedContactList',
                  //       JSON.stringify({
                  //         ...selectedContactList,
                  //         [item.recordID]: false,
                  //       })
                  //     );
                  //     let counter = Object.values({
                  //       ...selectedContactList,
                  //       [item.recordID]: false,
                  //     }).filter((value) => value)?.length;
                  //     AsyncStorage.setItem('counter', JSON.stringify(counter));
                  //     return;
                  //   }
                  // setSelectedContact(item);
                  // setShowModal(true);
                }}
                check={false}
              />
            );
          })
        : null}
    </View>
  );
};

export default ContactListComponent;
