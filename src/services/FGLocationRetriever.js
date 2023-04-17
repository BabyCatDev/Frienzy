import database from "@react-native-firebase/database";

import moment from "moment";

import AsyncStorage from "@react-native-async-storage/async-storage";
import OneSignal from "react-native-onesignal";
import { loadImg } from "../utils/helper";
import FGLocationTrackingService from "./FGLocationTrackingService";
import { sha1 } from "react-native-sha1";

export default class FGLocationRetriever {
  static instance = null;
  static getInstance() {
    if (this.instance == null) {
      this.instance = new FGLocationRetriever();
    }
    return this.instance;
  }

  constructor() {
    this.userKey = null;
    this.keysToTrack = [];
    this.keyToPhone = {};
    this.allowedKeysToTrackMe = [];
    this._onTick = this._onTick.bind(this);
    this._onUserLocationChange = this._onUserLocationChange.bind(this);
    this.intervalHandler = null;
    this.initialized = false;
  }

  init() {
    this.userKey = null;
    this.keysToTrack = [];
    this.keyToPhone = {};
    this.allowedKeysToTrackMe = [];
    this.intervalHandler = null;
    this.locationTrackingOn = false;

    if (!this.initialized) {
      FGLocationTrackingService.getInstance().init();
      FGLocationTrackingService.getInstance().setOnLocationListener(
        this._onUserLocationChange
      );
    }

    this._loadDataLocaly();

    this.initialized = true;
  }

  async _saveDataLocaly() {
    const data = {
      userKey: this.userKey,
      keysToTrack: this.keysToTrack,
      allowedKeysToTrackMe: this.allowedKeysToTrackMe,
      keyToPhone: this.keyToPhone,
      locationTrackingOn: this.locationTrackingOn,
    };

    await AsyncStorage.setItem("FGLocationRetriever", JSON.stringify(data));
  }

  async _loadDataLocaly() {
    const data = await AsyncStorage.getItem("FGLocationRetriever");
    if (data) {
      const parsedData = JSON.parse(data);
      this.userKey = parsedData.userKey;
      this.keysToTrack = parsedData.keysToTrack;
      this.allowedKeysToTrackMe = parsedData.allowedKeysToTrackMe;
      this.keyToPhone = parsedData.keyToPhone;

      if (parsedData.locationTrackingOn) {
        this.startLocationTracking();
      } else if (!parsedData.locationTrackingOn) {
        this.stopLocationTracking();
      }
    }
  }

  async _removeDataLocaly() {
    await AsyncStorage.removeItem("FGLocationRetriever");
  }

  async setUserPhone(phone) {
    this.userKey = await this._getUserKey(phone);
    OneSignal.sendTag("phone", this.userKey);
    await this._saveDataLocaly();
  }

  async sendNotiffication(phone, title, message) {
    const key = await this._getUserKey(phone);
    let headers = {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Basic MmQ5MTM5ZjMtYjEzMC00MjJkLWE1NGYtMzMyYjBiZTcyZmMw",
    };
    let endpoint = "https://onesignal.com/api/v1/notifications";
    let params = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        app_id: "146aaecb-a485-4ccd-82b7-5f154569d9c8",
        headings: { en: title },
        contents: { en: message },
        filters: [
          {
            field: "tag",
            key: "phone",
            relation: "=",
            value: key,
          },
        ],
      }),
    };
    fetch(endpoint, params)
      .then((res) => {
        console.log("sucess NotiButton");
      })
      .catch((error) => console.log("error" + error));
  }

  _onUserLocationChange(location) {
    try {
      database()
        .ref(`locations/${this.userKey}`)
        .set({
          lat: location.latitude,
          long: location.longitude,
          date: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
    } catch (error) {
      console.log(error);
    }
  }

  startLocationTracking() {
    FGLocationTrackingService.getInstance().startLocationTracking();

    this.locationTrackingOn = true;

    let ref = database().ref(`permissions/${this.userKey}`);
    ref.set(this.allowedKeysToTrackMe);

    this._saveDataLocaly();
  }

  stopLocationTracking() {
    FGLocationTrackingService.getInstance().stopLocationTracking();

    this.locationTrackingOn = false;

    let ref = database().ref(`permissions/${this.userKey}`);
    ref.set([]);

    this._saveDataLocaly();
  }

  async _onTick() {
    if (!this.locationTrackingOn) {
      this.onPhonesLocationsListener([]);
      return;
    }
    let locations = [];
    await Promise.all(
      this.keysToTrack.map(async (key) => {
        const ref = database().ref(`permissions/${key}`);
        const permissions = await ref.once("value");
        if (
          permissions.exists() &&
          (permissions.val().includes(this.userKey) || "*" in permissions)
        ) {
          const ref = database().ref(`locations/${key}`);
          const user = await ref.once(`value`);
          console.log(this.keyToPhone[key]);
          if (user.exists() && this.keyToPhone[key]) {
            const ref = database().ref(`users/${key}`);
            const userData = await ref.once(`value`);
            console.log(userData?.val()?.alarm);
            const userModel = user.val();
            userModel["phone"] = this.keyToPhone[key];
            userModel["alarm"] = userData?.val()?.alarm;
            userModel["profile_pic"] = userData?.val()?.profile_pic;
            userModel["key"] = key;
            locations = [...locations, userModel];
          }
        }
      })
    );

    if (this.onPhonesLocationsListener) {
      this.onPhonesLocationsListener(locations);
    }
  }

  startListeningToLocationUpdates() {
    if (this.intervalHandler != null) {
      clearInterval(this.intervalHandler);
    }
    this.intervalHandler = setInterval(this._onTick, 10000);
  }

  stopListeningToLocationUpdates() {
    clearInterval(this.intervalHandler);
    this.intervalHandler = null;
  }

  setPhonesToTrack(phones) {
    this.keysToTrack = Promise.all(
      phones.map(async (phone) => await this._getUserKey(phone))
    );

    this._saveDataLocaly();
  }

  async addPhoneToTrack(phone) {
    const key = await this._getUserKey(phone);

    if (!this.keysToTrack.includes(key)) {
      this.keysToTrack = [...this.keysToTrack, key];
    }

    this._saveDataLocaly();
  }

  async removePhoneToTrack(phone) {
    const key = await this._getUserKey(phone);

    if (this.keysToTrack.includes(key)) {
      this.keysToTrack = this.keysToTrack.filter((k) => k != key);
    }

    this._saveDataLocaly();
  }

  async reset() {
    await this._removeDataLocaly();
    this.init();
  }

  setOnPhonesLocationsListener(listener) {
    this.onPhonesLocationsListener = listener;
  }

  async allowPhonesToTrackMe(phones) {
    this.allowedKeysToTrackMe = await Promise.all(
      phones.map(async (phone) => await this._getUserKey(phone))
    );

    let ref = database().ref(`permissions/${this.userKey}`);
    const hashes = this.allowedKeysToTrackMe;

    ref.set(hashes);

    this._saveDataLocaly();
  }

  async allowPhoneToTrackMe(phone) {
    const key = await this._getUserKey(phone);

    if (!this.allowedKeysToTrackMe.includes(key)) {
      this.allowedKeysToTrackMe = [...this.allowedKeysToTrackMe, key];
    }

    let ref = database().ref(`permissions/${this.userKey}`);
    const hashes = this.allowedKeysToTrackMe;

    ref.set(hashes);

    this._saveDataLocaly();
  }

  async disallowPhoneToTrackMe(phone) {
    const key = await this._getUserKey(phone);

    if (this.allowedKeysToTrackMe.includes(key)) {
      this.allowedKeysToTrackMe = this.allowedKeysToTrackMe.filter(
        (k) => k != key
      );

      let ref = database().ref(`permissions/${this.userKey}`);
      const hashes = this.allowedKeysToTrackMe;

      ref.set(hashes);
    }

    this._saveDataLocaly();
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
