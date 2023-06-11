// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import Mapbox from '@rnmapbox/maps';

// Mapbox.setAccessToken(
//     'pk.eyJ1Ijoibm9sYW5kb25sZXkxNCIsImEiOiJjazJta2dqNmowaXR2M25uM3RyNzl4bmU1In0.IG-7dVSFafe9cSEpQJoU2A'
//   );

// const CreateItineraryItem = ({ onItemCreate }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);
//   const [date, setDate] = useState(null);
//   const [showStartTimePicker, setShowStartTimePicker] = useState(false);
//   const [showEndTimePicker, setShowEndTimePicker] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);

//   const handleCreateItem = () => {
//     const newItem = {
//       title,
//       description,
//       startTime: startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
//       endTime: endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
//       date: date ? date.toDateString() : '',
//       location: searchResults.length > 0 ? searchResults[0] : null,
//     };

//     // Clear the input fields
//     setTitle('');
//     setDescription('');
//     setStartTime(null);
//     setEndTime(null);
//     setDate(null);
//     setSearchQuery('');
//     setSearchResults([]);

//     // Call the onItemCreate callback with the new item
//     onItemCreate(newItem);
//   };

//   const handleStartTimeChange = (selectedTime) => {
//     setShowStartTimePicker(false);
//     if (selectedTime) {
//       setStartTime(selectedTime);
//     }
//   };

//   const handleEndTimeChange = (selectedTime) => {
//     setShowEndTimePicker(false);
//     if (selectedTime) {
//       setEndTime(selectedTime);
//     }
//   };

//   const handleDateChange = (selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       setDate(selectedDate);
//     }
//   };

//   const handleSearch = async () => {
//     try {
//       const response = await Mapbox.geocoding.forwardGeocode({
//         query: searchQuery,
//       });
//       const results = response.features.map((feature) => feature.place_name);
//       setSearchResults(results);
//     } catch (error) {
//       console.log('Error searching for location:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create New Itinerary Item</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Title"
//         value={title}
//         onChangeText={setTitle}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Description"
//         value={description}
//         onChangeText={setDescription}
//       />
//       <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowStartTimePicker(true)}>
//         <Text style={styles.timePickerButtonText}>{startTime ? `Start Time: ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Select Start Time'}</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowEndTimePicker(true)}>
//         <Text style={styles.timePickerButtonText}>{endTime ? `End Time: ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Select End Time'}</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowDatePicker(true)}>
//         <Text style={styles.timePickerButtonText}>{date ? `Date: ${date.toDateString()}` : 'Select Date'}</Text>
//       </TouchableOpacity>
//       <TextInput
//         style={styles.input}
//         placeholder="Location Search"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//       />
//       <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
//         <Text style={styles.searchButtonText}>Search</Text>
//       </TouchableOpacity>
//       {searchResults.length > 0 && (
//         <View style={styles.searchResults}>
//           <Text style={styles.searchResultsTitle}>Search Results:</Text>
//           {searchResults.map((result, index) => (
//             <Text key={index} style={styles.searchResultItem}>{result}</Text>
//           ))}
//         </View>
//       )}
//       <TouchableOpacity style={styles.addButton} onPress={handleCreateItem}>
//         <Text style={styles.addButtonText}>Add Item</Text>
//       </TouchableOpacity>
//       <DateTimePickerModal
//         isVisible={showStartTimePicker}
//         mode="time"
//         is24Hour={true}
//         onConfirm={handleStartTimeChange}
//         onCancel={() => setShowStartTimePicker(false)}
//       />
//       <DateTimePickerModal
//         isVisible={showEndTimePicker}
//         mode="time"
//         is24Hour={true}
//         onConfirm={handleEndTimeChange}
//         onCancel={() => setShowEndTimePicker(false)}
//       />
//       <DateTimePickerModal
//         isVisible={showDatePicker}
//         mode="date"
//         onConfirm={handleDateChange}
//         onCancel={() => setShowDatePicker(false)}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 20,
//     padding: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 35,
//     textAlign: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//   },
//   timePickerButton: {
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   timePickerButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   searchButton: {
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   searchButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   searchResults: {
//     marginTop: 10,
//   },
//   searchResultsTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   searchResultItem: {
//     fontSize: 14,
//   },
//   addButton: {
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   addButtonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default CreateItineraryItem;
