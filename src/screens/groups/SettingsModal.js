import React from 'react';
import { View, StyleSheet, Text, Pressable, Share } from 'react-native';
import { Colors } from '../../utils/Colors';
import Ionicon from 'react-native-vector-icons/Ionicons';

const BUTTON_TEXT_SIZE = 16;

const SettingsModal = ({ groupId }) => {
  const shareHandler = async () => {
    try {
      const result = await Share.share({
        url: `frienzy://groups/${groupId}`,
        title: 'Join My Frienzy',
        message: 'Checkout my group on Frienzy!',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with', result.activityType);
          // shared with activity type of result.activityType
        } else {
          console.log('Shared somehow');
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Dismissed share');
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const buttons = [
    {
      id: 0,
      title: 'Share',
      icon: <Ionicon name={'share-outline'} color={'white'} size={BUTTON_TEXT_SIZE + 8} />,
      onClick: () => shareHandler(),
      type: 'regular',
    },
    {
      id: 1,
      title: 'Add Friends',
      icon: <Ionicon name={'person-add-outline'} color={'white'} size={BUTTON_TEXT_SIZE + 8} />,
      onClick: () => console.log('Add Friends'),
      type: 'regular',
    },
    {
      id: 2,
      title: 'Delete',
      icon: <Ionicon name={'trash-outline'} color={'red'} size={BUTTON_TEXT_SIZE + 8} />,
      onClick: () => console.log('Delete'),
      type: 'danger',
    },
  ];

  const ButtonComp = ({ button }) => {
    return (
      <Pressable onPress={button.onClick} style={styles.buttonContainer}>
        <Text style={[styles.buttonText, { color: button.type == 'danger' ? 'red' : 'white' }]}>
          {button.title}
        </Text>
        {button.icon}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Group Settings</Text>
      {buttons.map((button) => {
        return <ButtonComp key={button.id} button={button} />;
      })}
    </View>
  );
};

export default SettingsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: BUTTON_TEXT_SIZE,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 3,
    padding: 10,
    flex: 1,
    backgroundColor: Colors.gray,
    borderRadius: 10,
  },
});
