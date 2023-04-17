import database from "@react-native-firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import storage from "@react-native-firebase/storage";
import { sha1 } from "react-native-sha1";

export default class FBSaver {
  static instance = null;
  static getInstance() {
    if (this.instance == null) {
      this.instance = new FBSaver();
    }
    return this.instance;
  }

  constructor() {
    this.userKey = null;
    this.keyToPhone = {};
    this.profilePicture = "";
  }

  init() {
    this.userKey = null;
    this.keyToPhone = {};
    this.profilePicture = "";
    this._loadDataLocaly();
  }

  async _saveDataLocaly() {
    const data = {
      userKey: this.userKey,
      keyToPhone: this.keyToPhone,
      profilePicture: this.profilePicture,
    };

    await AsyncStorage.setItem("FBSaver", JSON.stringify(data));
  }

  async _loadDataLocaly() {
    const data = await AsyncStorage.getItem("FBSaver");
    if (data) {
      const parsedData = JSON.parse(data);
      this.userKey = parsedData.userKey;
      this.keyToPhone = parsedData.keyToPhone;
      this.profilePicture = parsedData.profilePicture;
    }
  }

  async _removeDataLocaly() {
    await AsyncStorage.removeItem("FBSaver");
  }

  async setUserPhone(phone) {
    this.userKey = await this._getUserKey(phone);
    await this._saveDataLocaly();
  }

  async saveProfilePic(path, platform) {
    try {
      if (this.profilePicture !== "") {
        await storage().ref(`UsersPhotos/${this.profilePicture}`).delete();
      }
      const filename =
        this.userKey + "-" + path?.substring(path?.lastIndexOf("/") + 1);
      const reference = storage().ref(`UsersPhotos/${filename}`);
      const pathToFile =
        platform === "ios" ? path?.replace("file://", "") : path;
      const res = await reference.putFile(pathToFile);
      console.log(res);
      const url = await storage()
        .ref(`UsersPhotos/${filename}`)
        .getDownloadURL();
      console.log(url);
      database().ref(`users/${this.userKey}`).update({
        profile_pic: url,
      });
      this.profilePicture = filename;
      // return url;
    } catch (e) {
      console.log(e);
    }
  }

  saveUsername(name) {
    try {
      database().ref(`users/${this.userKey}`).update({
        username: name,
      });
    } catch (error) {
      console.log(error);
    }
  }

  updateAlarm(value) {
    try {
      database().ref(`users/${this.userKey}`).update({
        alarm: value,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createUser() {
    try {
      const user = await this.getUserData();
      if (user == null) {
        database().ref(`users/${this.userKey}`).set({
          username: "Frienzy Nickname",
          profile_pic: "",
          alarm: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  deleteUserData() {
    let ref = database().ref(`users/${this.userKey}`);
    ref.set(null);
    this._saveDataLocaly();
  }
  async deleteProfilePicture() {
    if (this.profilePicture !== "") {
      const reference = storage().ref(`UsersPhotos/${this.profilePicture}`);
      await reference.delete();
      this._saveDataLocaly();
    }
  }

  async getUserData() {
    const ref = database().ref(`users/${this.userKey}`);
    const user = await ref.once(`value`);
    if (user.exists() && this.keyToPhone[this.userKey]) {
      const userModel = user.val();
      userModel["phone"] = this.keyToPhone[this.userKey];
      return userModel;
    }
    return null;
  }

  async getFriendData(key) {
    const ref = database().ref(`users/${key}`);
    const user = await ref.once(`value`);
    if (user.exists() && this.keyToPhone[key]) {
      const userModel = user.val();
      return userModel;
    }
    return null;
  }

  async reset() {
    this.deleteUserData();
    await this.deleteProfilePicture();
    await this._removeDataLocaly();
    this.init();
  }

  async _getUserKey(phone) {
    if (phone == "*") {
      return "*";
    }

    const numeric_string = phone.replace(/\D/g, "");

    console.log(phone);
    console.log(numeric_string);

    const key = await sha1(numeric_string.substring(numeric_string.length - 7));
    console.log(key);
    this.keyToPhone[key] = phone;
    return key;
  }
}
