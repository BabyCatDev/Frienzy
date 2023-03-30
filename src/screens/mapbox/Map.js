import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  Text,
} from "react-native";
import Mapbox from "@rnmapbox/maps";
import { Header } from "../profile/Header";
import { AssetImage } from "../../assets/asset_image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Assets from "../../assets";
import normalize from "react-native-normalize";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../utils/Colors";
import { useSelector } from "react-redux";
import GetLocation, {
  Location,
  LocationError,
  LocationErrorCode,
} from "react-native-get-location";
import FGLocationRetriever from "../../services/FGLocationRetriever";
import { useFocusEffect } from "@react-navigation/native";

Mapbox.setAccessToken(
  "pk.eyJ1IjoiYmFuYXJ1bXMiLCJhIjoiY2xlc2MxdGdrMGlicjNwbjFheWd1YzNwZSJ9.fnUNAsXBtfkFa1ceAVe_Pg"
);
const Map = ({ navigation }) => {
  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [counter, setCounter] = useState();
  const { allowedContacts } = useSelector((state) => state.auth);
  const [contacts, setContacts] = useState([]);

  const [users, setUsers] = useState([]);

  const onUsersLocationUpdate = (locations) => {
    setUsers(locations.map((location) => {
      return {
        phone: location.phone,
        coordinates: [location.long, location.lat],
        date: location.date,
      }
    }));
  }
  const getContacts = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      FGLocationRetriever.getInstance().setOnPhonesLocationsListener(onUsersLocationUpdate);

      FGLocationRetriever.getInstance().startListeningToLocationUpdates();

      async function getCounter() {
        const counter = await getData("counter");
        setCounter(counter);
      }
      getCounter();
      
      // returned function will be called on component unmount 
      return () => {
        FGLocationRetriever.getInstance().stopListeningToLocationUpdates();
      }
    }, [])
  );

  useEffect(() => {
    requestLocation();
  }, []);

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log(value)
        return JSON.parse(value);
        
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  };


  const requestLocation = () => {
    setLoading(true);
    setLocation(null);
    setError(null);

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
      rationale: {
        title: "Location permission",
        message: "The app needs the permission to request your location.",
        buttonPositive: "Ok",
      },
    })
      .then((newLocation) => {
        setLoading(false);
        setLocation(newLocation);
      })
      .catch((ex) => {
        if (ex instanceof LocationError) {
          const { code, message } = ex;
          console.warn(code, message);
          setError(code);
        } else {
          console.warn(ex);
        }
        setLoading(false);
        setLocation(null);
      });
  };
  useEffect(() => {
    console.log("user location: ", location);
  }, [location]);

  useEffect(() => {
    async function getCounter() {
      const counter = await getData("counter");
      const contacts = await getContacts("contacts");
      setContacts(contacts);
      setCounter(counter);
    }
    getCounter();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LinearGradient
        style={{
          height: height * 0.14,
          width: "100%",
          paddingTop: height * 0.075,
          backgroundColor: "red",
          paddingHorizontal: 20,
        }}
        colors={Colors.backgroundGradient}
      >
        <Header
          onPressRight={() => navigation.push("ProfileStack")}
          rightIcon={Assets.userProfile}
          rightWidth={23}
          rightHeight={23}
          title={"Coachella"}
          friendsCounter={`${counter} friends`}
          navigation={navigation}
          noBackButton
        />
      </LinearGradient>
      <View style={{ height: height * 0.86, width: "100%" }}>
        <Mapbox.MapView
          style={{ ...StyleSheet.absoluteFillObject }}
          // styleURL={"mapbox://styles/mapbox/satellite-v9"}
        >
          <Mapbox.Camera
            followZoomLevel={5}
            // zoomLevel={15}
            zoomLevel={18}
            centerCoordinate={location ? [location.longitude, location.latitude] : null}
            // [-116.23935536523643, 33.68370272168475] Coachella here
            animationDuration={1000}
          />
          {users.map((user) => (<Mapbox.PointAnnotation
            coordinate={user.coordinates}
            id={user.phone}
            key={user.phone}
            
          >
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: "blue",
                borderRadius: 50,
                borderColor: "#fff",
                borderWidth: 3,
              }}
            />
          </Mapbox.PointAnnotation>))}
          <Mapbox.PointAnnotation
            coordinate={[-116.23935536523643, 33.68370272168475]}
            id={"1"}
          >
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: "red",
                borderRadius: 50,
                borderColor: "#fff",
                borderWidth: 3,
              }}
            />
          </Mapbox.PointAnnotation>
          {/* <Mapbox.MarkerView
            id={"marker"}
            coordinate={[-116.23935536523643, 33.68370272168475]}
          > */}
          {/* <View> */}
          {/* <View
                style={{
                  alignItems: "center",
                  width: 60,
                  backgroundColor: "transparent",
                  height: 70,
                }}
              > */}
          {/* <AssetImage
              asset={Assets.splash}
              width={24}
              height={24}
              containerStyle={{ backgroundColor: "red" }}
            /> */}
          {/* </View> */}
          {/* </View> */}
          {/* </Mapbox.MarkerView> */}

          <Mapbox.UserLocation
          // children={() =>
          //   <View
          //     style={{
          //       height: 30,
          //       width: 30,
          //       backgroundColor: "red",
          //       borderRadius: 50,
          //       borderColor: "#fff",
          //       borderWidth: 3,
          //     }}
          //   ></View>
          // }
          />
        </Mapbox.MapView>
        <Pressable
          style={{ position: "absolute", left: 10, bottom: 58 }}
          onPress={() => navigation.push("ContactsStack")}
        >
          <AssetImage
            asset={Assets.addUser}
            width={normalize(90)}
            height={normalize(91)}
          />
        </Pressable>
        <Pressable
          style={{ position: "absolute", right: 10, bottom: 144.56 }}
          onPress={requestLocation}
        >
          <AssetImage
            asset={Assets.userPosition}
            width={normalize(90)}
            height={normalize(91)}
          />
        </Pressable>
        <Pressable style={{ position: "absolute", right: 10, bottom: 58 }}>
          <AssetImage
            asset={Assets.emrgButton}
            width={normalize(90)}
            height={normalize(91)}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default Map;
