import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image } from 'react-native';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-picker';
import { getPhoto } from '../../services/helpers/photoPicker';
import { selectImage } from '../../services/helpers/selectImage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicon from 'react-native-vector-icons/Ionicons';

export const NewFrienzyCreation = ({ navigation }) => {
    const [photo, setPhoto] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [location, setLocation] = useState('');
    const [endDate, setEndDate] = useState(null);
    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

    const handlePhotoPicker = () => {
        selectImage((uri) => {
            setPhoto(uri);
        });
    };


    const showStartDatePicker = () => {
        setStartDatePickerVisible(true);
    };

    const hideStartDatePicker = () => {
        setStartDatePickerVisible(false);
    };

    const handleStartDateConfirm = date => {
        setStartDate(date);
        hideStartDatePicker();
    };

    const showEndDatePicker = () => {
        setEndDatePickerVisible(true);
    };

    const hideEndDatePicker = () => {
        setEndDatePickerVisible(false);
    };

    const handleEndDateConfirm = date => {
        setEndDate(date);
        hideEndDatePicker();
    };

    const isValidInputs = () => {
        if (
            photo == null ||
            title === '' ||
            location === '' ||
            description === '' ||
            startDate === null ||
            endDate === null
        ) {
            return false;
        }

        return true;
    }

    const handleNext = () => {
        if (!isValidInputs()) {
            // Show an error toast message 
            Toast.show({
                type: 'error',
                text1: 'Please input all the fields',
                visibilityTime: 2000, // Adjust the duration as per your preference
                autoHide: true,
            });
            return;
        }

        navigation.navigate('InviteFriendsScreen', {
            photo: photo,
            title,
            location,
            description,
            startDate,
            endDate,
        });
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicon name="arrow-back" size={24} color="black" />
            </Pressable>
            <Text style={styles.headerText}>Create Frienzy</Text>
            <View style={styles.photoContainer}>
                {photo ? (
                    <Image source={{ uri: photo }} style={styles.photo} />
                ) : (
                    <View style={styles.photoPicker}>
                        <Pressable style={styles.photoPickerButton} onPress={handlePhotoPicker}>
                            <View style={styles.iconContainer}>
                                <Ionicon name="pencil" size={24} color="#FB5F2D" />
                            </View>
                        </Pressable>
                    </View>
                )}
            </View>
            <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor={"gray"}
                fontSize={16}
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                placeholderTextColor={"gray"}
                fontSize={16}
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Location"
                placeholderTextColor={"gray"}
                fontSize={16}
                value={location}
                onChangeText={setLocation}
            />
            <View style={styles.datePickerContainer}>
                <View style={styles.datePicker}>
                    <Pressable style={styles.datePickerButton} onPress={showStartDatePicker}>
                        <Text style={styles.datePickerButtonText}>
                            {startDate ? startDate.toString() : 'Select Start Date'}
                        </Text>
                    </Pressable>
                    <DateTimePickerModal
                        isVisible={isStartDatePickerVisible}
                        mode="date"
                        onConfirm={handleStartDateConfirm}
                        onCancel={hideStartDatePicker}
                    />
                </View>
                <View style={styles.datePicker}>
                    <Pressable style={styles.datePickerButton} onPress={showEndDatePicker}>
                        <Text style={styles.datePickerButtonText}>
                            {endDate ? endDate.toString() : 'Select End Date'}
                        </Text>
                    </Pressable>
                    <DateTimePickerModal
                        isVisible={isEndDatePickerVisible}
                        mode="date"
                        onConfirm={handleEndDateConfirm}
                        onCancel={hideEndDatePicker}
                    />
                </View>
            </View>
            <Pressable style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 20,
    },
    backButton: {
        position: 'absolute',
        marginTop: 25,
        top: 10,
        left: 10,
        zIndex: 1,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 18,
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 40,
    },
    photo: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
    photoPicker: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: '#FB5F2D',
    },
    datePicker: {
        flex: 1,
      },
    photoPickerButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderRadius: 20,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    datePickerButton: {
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },
    datePickerButtonText: {
        fontSize: 16,
        color: 'gray',
    },
    nextButton: {
        height: 40,
        backgroundColor: '#FB5F2D',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    nextButtonText: {
        fontSize: 16,
        color: 'white',
    },
});
