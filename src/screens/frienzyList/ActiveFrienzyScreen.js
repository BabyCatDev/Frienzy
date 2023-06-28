import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Itinerary } from '../itinerary/Itinerary';
import { SharedPhotosScreen } from '../sharedPhotos/sharedPhotosScreen';
import { Map } from '../map/Map';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { formatDate } from '../../utils/FormatDate';
// Placeholder components for the three tabs


export const ActiveFrienzy = ({ navigation, route }) => {
  const Tab = createMaterialTopTabNavigator();
  const { groupInfo } = route.params;


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <View style={styles.headerText}>
            <Text style={styles.title}>{groupInfo.name}</Text>
            <Text style={styles.subtitle}>
              {groupInfo.startDate && groupInfo.endDate
                ? `${formatDate(new Date(groupInfo.startDate.seconds * 1000))} - ${formatDate(new Date(groupInfo.endDate.seconds * 1000))}`
                : 'N/A'}
            </Text>
          </View>
          <Ionicon
            name="chatbox"
            size={24}
            color="black"
            style={styles.chatIcon}
            onPress={() =>
              navigation.push('GroupThread', { threadId: groupInfo.id })
            }
          />
        </View>
      </View>
      <View style={styles.tabContent}>
        <Tab.Navigator
          tabBarOptions={{
            labelStyle: { fontSize: 16, fontWeight: 'bold' },
            indicatorStyle: { backgroundColor: '#FB5F2D' },
            activeTintColor: '#FB5F2D',
            inactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen
            name="Photos"
            component={SharedPhotosScreen}
            initialParams={{ currentGroup: groupInfo.id }}
            options={{
              tabBarLabel: 'Photos',
              tabBarStyle: { fontSize: 16, fontWeight: 'bold' },
            }}
          />
          <Tab.Screen
            name="Itinerary"
            component={Itinerary}
            initialParams={{ currentGroup: groupInfo.id }}
            options={{
              tabBarLabel: 'Itinerary',
              tabBarStyle: { fontSize: 16, fontWeight: 'bold' },
            }}
          />
          <Tab.Screen
            name="Friends"
            component={Map}
            initialParams={{ currentGroup: groupInfo.id }}
            options={{
              tabBarLabel: 'Friends',
              tabBarStyle: { fontSize: 16, fontWeight: 'bold' },
            }}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIcon: {
    marginTop: 20,
  },
  headerText: {
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatIcon: {
    marginTop: 10,
  },
  tabContent: {
    flex: 1,
    marginTop: 20,
  },
});