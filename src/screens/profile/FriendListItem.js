import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Colors } from '../../utils/Colors';
import { AppStyles } from '../../utils/AppStyles';
import normalize from 'react-native-normalize';
import LinearGradient from 'react-native-linear-gradient';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../../hooks/useUser';

export const FriendListItem = ({ item, onPressHandler, index, selected, showChecks = false }) => {
  const { data: userData, isLoading } = useUser(item);

  const getInitials = (name) => {
    const fullName = name;
    return fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('');
  };

  if (isLoading) return null;

  const handlePress = () => {
    onPressHandler({ itemClicked: item });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        ...AppStyles.contactItem,
        marginTop: !index ? normalize(6.56) : 0,
        borderTopWidth: index ? 1.5 : 0,
        borderTopColor: index ? Colors.gray : 'transparent',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={AppStyles.contactImageContainer}>
          {userData.profilePic ? (
            <Image
              resizeMode="cover"
              source={{ uri: userData.profilePic }}
              style={AppStyles.contactImage}
            />
          ) : (
            <Text style={AppStyles.semibold25}>{getInitials(userData.name).substr(0, 2)}</Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...AppStyles.semibold17, maxWidth: 300 }}>{userData.name}</Text>
          <Text style={AppStyles.medium13}>{userData.phone}</Text>
        </View>
        {showChecks && (
          <View
            style={{
              ...AppStyles.checkBoxContainer,
              backgroundColor: selected ? Colors.primary : Colors.gray,
            }}
          >
            {selected && (
              <Ionicon name={'checkmark-sharp'} size={normalize(13)} color={'orange'} />
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};
