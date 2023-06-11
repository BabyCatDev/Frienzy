import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export const ItineraryHeader = () => {
  return (
    <View style={styles.container}>
      <Text
        style={styles.titleInput}
        >Itinerary
    </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  titleInput: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    fontColor: 'black',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

