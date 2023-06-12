import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, KeyboardAvoidingView, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import Mapbox from '@rnmapbox/maps';

const CreateItineraryItem = ({ route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [date, setDate] = useState(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { onItemCreate, currentGroup } = route.params;
  const navigate = useNavigation();
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const windowHeight = Dimensions.get('window').height;
  const navigationBarHeight = 50; // Replace with your navigation bar's height

  useEffect(() => {
    console.log('current group', currentGroup)
    const calculateScrollViewHeight = () => {
      const height = windowHeight - navigationBarHeight;
      setScrollViewHeight(height);
    };

    calculateScrollViewHeight();
  }, []);

  const handleCreateItem = () => {
    if (!title || !description || !startTime || !endTime || !date || !selectedLocation) {
      Alert.alert('Please fill out all required fields.');
      return;
    }

    const newItem = {
      title,
      description,
      startTime: startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      endTime: endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      date: date ? date.toDateString() : '',
      location: selectedLocation,
    };

    // Clear the input fields
    setTitle('');
    setDescription('');
    setStartTime(null);
    setEndTime(null);
    setDate(null);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedLocation(null);

    // Call the onItemCreate callback with the new item
    onItemCreate(newItem);

    // Go back to the previous screen
    navigate.goBack();
  };

  const handleStartTimeChange = (selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const handleEndTimeChange = (selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const handleDateChange = (selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSearch = async () => {
    try {
      const token = 'pk.eyJ1Ijoibm9sYW5kb25sZXkxNCIsImEiOiJjazJta2dqNmowaXR2M25uM3RyNzl4bmU1In0.IG-7dVSFafe9cSEpQJoU2A';
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${token}&autocomplete=true&types=poi`;
      const response = await fetch(endpoint);
      const data = await response.json();
      const results = data.features.map((feature) => feature.place_name);
      setSearchResults(results);
    } catch (error) {
      console.log('Error searching for location:', error);
    }
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Create New Itinerary Item</Text>
      <Text>{currentGroup}</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowStartTimePicker(true)}>
        <Text style={styles.timePickerButtonText}>{startTime ? `Start Time: ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Select Start Time'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowEndTimePicker(true)}>
        <Text style={styles.timePickerButtonText}>{endTime ? `End Time: ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Select End Time'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.timePickerButtonText}>{date ? `Date: ${date.toDateString()}` : 'Select Date'}</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Location Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
      {searchResults.length > 0 && (
        <View style={styles.searchResults}>
          <Text style={styles.searchResultsTitle}>Search Results:</Text>
          {searchResults.map((result, index) => (
            <TouchableOpacity key={index} onPress={() => handleSelectLocation(result)}>
              <Text style={styles.searchResultItem}>{result}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {selectedLocation && (
        <View style={styles.selectedLocation}>
          <Text style={styles.selectedLocationTitle}>Selected Location:</Text>
          <Text style={styles.selectedLocationItem}>{selectedLocation}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleCreateItem}>
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showStartTimePicker}
        mode="time"
        is24Hour
        onConfirm={handleStartTimeChange}
        onCancel={() => setShowStartTimePicker(false)}
      />
      <DateTimePickerModal
        isVisible={showEndTimePicker}
        mode="time"
        is24Hour
        onConfirm={handleEndTimeChange}
        onCancel={() => setShowEndTimePicker(false)}
      />
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleDateChange}
        onCancel={() => setShowDatePicker(false)}
      />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  timePickerButton: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  timePickerButtonText: {
    fontSize: 16,
  },
  searchButton: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#ccc',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchResults: {
    marginBottom: 8,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  searchResultItem: {
    marginBottom: 6,
  },
  selectedLocation: {
    marginBottom: 1,
  },
  selectedLocationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  selectedLocationItem: {
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: -7
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateItineraryItem;
