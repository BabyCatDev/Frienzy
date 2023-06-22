import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Itinerary } from '../../screens/itinerary/Itinerary';
import { Map } from '../../screens/mapbox/Map';
import Ionicon from 'react-native-vector-icons/Ionicons';
// Placeholder components for the three tabs
const PhotosTab = () => (
    <View style={styles.tabContainer}>
        <Text>Photos</Text>
    </View>
);

export const ActiveFrienzy = ({ navigation, route }) => {
    const Tab = createMaterialTopTabNavigator();
    const { groupInfo } = route.params;

    console.log('groupInfo in activeFrienzy', groupInfo)

    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>{groupInfo.name}</Text>
              <Text style={styles.subtitle}>Start Date - End Date</Text>
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
          <View style={styles.tabContent}>
            <Tab.Navigator>
              <Tab.Screen 
              name="Photos" 
              component={PhotosTab} 
              initialParams={{ currentGroup: groupInfo.id }}/>
              <Tab.Screen
                name="Itinerary"
                component={Itinerary}
                initialParams={{ currentGroup: groupInfo.id }}
              />
              <Tab.Screen
                name="Map"
                component={Map}
                initialParams={{ currentGroup: groupInfo.id }}
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
      headerText: {
        flex: 1,
        marginRight: 10,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 20,
      },
      subtitle: {
        fontSize: 14,
        color: 'gray',
      },
      chatIcon: {
        marginLeft: 10,
        marginTop: 20,
      },
      tabContent: {
        flex: 1,
        marginTop: 20,
      },
    });