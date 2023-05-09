import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import normalize from 'react-native-normalize';
import { AppStyles } from '../utils/AppStyles';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import { getGroupsForUser } from '../services/firebase/user';

export const Header = ({
  title,
  containerStyle,
  onPressLeft,
  onPressRight,
  rightIcon,
  leftIcon,
  friendsCounter,
  rightWidth,
  rightHeight,
  navigation,
  noBackButton,
  headerButton,
  headerValue,
  setHeaderValue,
  onPressHeader,
}) => {
  const [open, setOpen] = useState(false);
  const userDetails = useSelector((state) => state.FrienzyAuth.userDetails);
  const [groupItems, setGroupItems] = useState([]);

  useEffect(() => {
    async function getUserGroups() {
      const tempDetails = await getGroupsForUser(userDetails.groups);
      const formattedData = tempDetails.map((td) => {
        return { label: td.name, value: td.id };
      });
      setGroupItems(formattedData);
    }
    getUserGroups();
  }, [userDetails]);

  return (
    <View
      style={{
        ...AppStyles.headerContainer,
        ...containerStyle,
      }}
    >
      {noBackButton ? (
        leftIcon ? (
          <Pressable style={AppStyles.headerRightIcon} onPress={onPressLeft}>
            {leftIcon()}
          </Pressable>
        ) : (
          <View style={{ width: normalize(27), height: normalize(27) }} />
        )
      ) : (
        <Pressable
          style={{
            width: normalize(27),
            height: normalize(27),
          }}
          onPress={() => navigation.canGoBack() && navigation.pop()}
        >
          <Ionicon name={'chevron-back-outline'} size={normalize(20)} color={'white'} />
        </Pressable>
      )}
      <View style={{ width: '71%', flexGrow: 1, zIndex: 100 }}>
        {headerButton ? (
          <DropDownPicker
            open={open}
            value={headerValue}
            items={groupItems}
            setOpen={setOpen}
            setValue={setHeaderValue}
            setItems={setGroupItems}
            mode="BADGE"
            ArrowUpIconComponent={({ style }) => (
              <Ionicon name={'chevron-up'} color={'white'} size={20} style={style} />
            )}
            ArrowDownIconComponent={({ style }) => (
              <Ionicon name={'chevron-down'} color={'white'} size={20} style={style} />
            )}
            containerStyle={{
              padding: 0,
            }}
            style={{
              backgroundColor: 'transparent',
              borderWidth: 0,
              justifyContent: 'center',
            }}
            labelStyle={{
              ...AppStyles.semibold20,
              textAlign: 'center',
              color: 'white',
              flex: 0,
            }}
          />
        ) : (
          <Text style={{ ...AppStyles.semibold22, textAlign: 'center' }}>{title}</Text>
        )}

        {friendsCounter && (
          <Text style={{ ...AppStyles.medium17, textAlign: 'center' }}>{friendsCounter}</Text>
        )}
      </View>
      <Pressable style={AppStyles.headerRightIcon} onPress={onPressRight}>
        {rightIcon && rightIcon()}
      </Pressable>
    </View>
  );
};
