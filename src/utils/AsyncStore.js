import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeObject = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};
export const storeValue = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};

export const removeValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }

  console.log("Done.");
};

export const getObject = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};

export const getBool = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : false;
  } catch (e) {
    console.log(e);
  }
};

export const getValue = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? value : null;
  } catch (e) {
    console.log(e);
  }
};
