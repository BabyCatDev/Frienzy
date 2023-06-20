import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Itinerary } from '../../screens/itinerary/Itinerary';
import { Map } from '../../screens/mapbox/Map';
// Placeholder components for the three tabs
const PhotosTab = () => (
  <View style={styles.tabContainer}>
    <Text>Photos</Text>
  </View>
);

export const ActiveFrienzy = ({ route }) => {
  const Tab = createMaterialTopTabNavigator();
  const { groupInfo } = route.params;
 
  console.log('groupInfo in activeFrienzy', groupInfo)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{groupInfo.name}</Text>
        <Text style={styles.subtitle}>Start Date - End Date</Text>
      </View>
      <View style={styles.tabContent}>
        <Tab.Navigator>
          <Tab.Screen name="Photos" component={PhotosTab} />
          <Tab.Screen name="Itinerary" component={Itinerary} initialParams={{ currentGroup: groupInfo.id }} />
          <Tab.Screen name="Map" component={Map} initialParams={{ currentGroup: groupInfo.id }}/>
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontColor: 'black',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
  tabContent: {
    flex: 1,
    marginTop: 20,
  },
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

