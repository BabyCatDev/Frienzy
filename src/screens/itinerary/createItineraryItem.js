import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Colors } from '../../utils/Colors';
import { AppStyles } from '../../utils/AppStyles';


export const CreateItineraryItem = ({ route, navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [date, setDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { onItemCreate, currentGroup } = route.params;
  const handleStartTimeChange = (selectedTime) => {
    setStartTime(selectedTime);
    setShowStartTimePicker(false);
  };

  const handleEndTimeChange = (selectedTime) => {
    setEndTime(selectedTime);
    setShowEndTimePicker(false);
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleSearch = async () => {
    try {
      const token = 'pk.eyJ1Ijoibm9sYW5kb25sZXkxNCIsImEiOiJjazJta2dqNmowaXR2M25uM3RyNzl4bmU1In0.IG-7dVSFafe9cSEpQJoU2A';
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${token}&autocomplete=true&types=poi`;
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log('Search response:', data);
      const results = data.features.map((feature) => feature.place_name);
      setSearchResults(data.features);
      console.log('Search results:', results);
    } catch (error) {
      console.log('Error searching for location:', error);
    }
  };

  const handleSelectLocation = (location) => {
    const selectedFeature = searchResults.find((feature) => feature.place_name === location);
    if (selectedFeature) {
      const { place_name: name, center: [longitude, latitude] } = selectedFeature;
      setSelectedLocation({ name, latitude, longitude });
      console.log('Selected location:', selectedLocation);
    }
  };

  const handleCreateItem = () => {
    // Check if all required fields are filled
    if (!title || !description || !startTime || !endTime || !date || !selectedLocation) {
     Alert.alert('Please fill all the required fields.');
      return;
    }

    const formattedStartTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedEndTime = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = date.toDateString();

    // Create the itinerary item
    const newItem = {
      title,
      description,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      date: formattedDate,
      location: selectedLocation,
    };

    // Call the onItemCreate function to handle the item creation
    onItemCreate(newItem);

    navigation.navigate('Itinerary', { currentGroup });
    // Reset the form fields
    setTitle('');
    setDescription('');
    setStartTime(null);
    setEndTime(null);
    setDate(null);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedLocation(null);

    console.log('Creating itinerary item...');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{...AppStyles.semibold20, marginLeft: 15 }}>Create New Itinerary Item</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
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
          <Text style={styles.title}>{startTime ? `Start Time: ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Select Start Time'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowEndTimePicker(true)}>
          <Text style={styles.title}>{endTime ? `End Time: ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Select End Time'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.title}>{date ? `Date: ${date.toDateString()}` : 'Select Date'}</Text>
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
              <TouchableOpacity key={index} onPress={() => handleSelectLocation(result.place_name)}>
                <Text style={styles.searchResultItem}>{result.place_name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {selectedLocation && (
          <View style={styles.selectedLocation}>
            <Text style={styles.selectedLocationTitle}>Selected Location:</Text>
            <Text style={styles.selectedLocationItem}>{selectedLocation.name}</Text>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 25,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  scrollContent: {
    paddingBottom: 100, // Adjust this value as needed
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
    backgroundColor: '',
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
    backgroundColor: '#FB5F2D',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: -7,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateItineraryItem;
