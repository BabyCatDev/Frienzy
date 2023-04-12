import React, { Children, memo, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  Image,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import Mapbox from "@rnmapbox/maps";
import { shapeSource } from "@rnmapbox/maps";
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
import { getObject } from "../../utils/AsyncStore";
import FGLocationRetriever from "../../services/FGLocationRetriever";
import { useFocusEffect } from "@react-navigation/native";
import coachellaOverlayData from "../../assets/coachella.json";
import { getMobileNumber } from "../../utils/helper";
import OverlayScreen from "./OverlayScreen";

//this is my personal access token, you can use your own, I think it's tied to my secret token which is hardcoded to my environment
Mapbox.setAccessToken(
  "pk.eyJ1Ijoic29jaWFsbmF2IiwiYSI6ImNsZXB2N2g4aTBhOWQzenE2ZTcxdmxlOGoifQ.HL3LG1DJoVRYTZGH9nsOmA"
);
const Map = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState([
    -116.23774063311555, 33.68024422721021,
  ]);
  const [error, setError] = useState(null);
  const [counter, setCounter] = useState();
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState({});
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const renderUsers = filterUsers(users);
  const [userToPush, setUserToPush] = useState("");
  async function getContacts() {
    const selectedContactList = await getObject("selectedContactList");
    const contacts = await getObject("contacts");
    setSelectedContacts(selectedContactList);
    setContacts(contacts);
  }

  useEffect(() => {
    getContacts();
  }, []);

  // useEffect(() => {
  //   filterUsers(users);
  // }, [users]);

  const UserMarker = () => (
    <LinearGradient
      colors={["#FF857933", "#FFA56033"]}
      useAngle={true}
      angle={225}
      style={{
        width: normalize(86),
        height: normalize(86),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: normalize(43),
      }}
    >
      <AssetImage
        asset={Assets.userPoint}
        width={normalize(29)}
        height={normalize(29)}
      />
    </LinearGradient>
  );

  const getInitials = (name, surname) => {
    const fullName = name + " " + surname;
    return fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("");
  };

  const FriendMarker = memo(({ contact, setUserToPush, setVisible }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setVisible(true);
          setUserToPush(contact.phone);
        }}
      >
        <AssetImage
          asset={Assets.userMarker}
          width={normalize(51)}
          height={normalize(56)}
        />
        <View
          style={{
            width: normalize(51),
            height: normalize(51),
            position: "absolute",
            borderRadius: normalize(26),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {contact.thumbnailPath !== null ? (
            <Image
              source={{ uri: contact.thumbnailPath }}
              style={{ width: normalize(42), height: normalize(42) }}
            />
          ) : (
            <View
              style={{
                width: normalize(42),
                height: normalize(42),
                borderRadius: normalize(21),
                backgroundColor: Colors.darkGray,
                justifyContent: "center",
                alignItems: "center",
              }}
              children={
                <Text style={{ color: Colors.white, fontSize: normalize(18) }}>
                  {getInitials(contact.givenName, contact.familyName)}
                </Text>
              }
            />
          )}
        </View>
      </TouchableOpacity>
    );
  });

  const onStagePress = (stage) => {
    setSelectedStage(stage.id);
  };

  const renderStages = () => {
    return stages.map((stage) => {
      const isSelected = selectedStage === stage.id;
      const fillColor = isSelected ? "#00FF00" : "#0000FF";

      return (
        <Mapbox.ShapeSource
          key={stage.id}
          id={stage.id}
          shape={{
            type: "Point",
            coordinates: stage.coordinates,
          }}
        >
          <Mapbox.CircleLayer
            id={`${stage.id}-circle`}
            style={{
              circleColor: fillColor,
              circleRadius: 10,
            }}
          />
          <Mapbox.SymbolLayer
            id={`${stage.id}-label`}
            style={{
              textField: stage.stageName,
              textSize: 12,
              textOffset: [0, 1],
              textAnchor: "top",
            }}
          />
        </Mapbox.ShapeSource>
      );
    });
  };

  const onUsersLocationUpdate = (locations) => {
    const users = locations.map((location) => {
      // console.log(location.phone, [location.long, location.lat])
      return {
        phone: location.phone,
        coordinates: [location.long, location.lat],
        date: location.date,
      };
    });

    setUsers(users);
  };

  function filterUsers(users) {
    const renderUsers = [];
    for (elem in contacts) {
      const phone = getMobileNumber(contacts[elem]);
      const user = users.find((user) => user.phone == phone);
      if (user !== undefined) {
        renderUsers.push({
          phone: user.phone,
          coordinates: user.coordinates,
          givenName: contacts[elem].givenName,
          familyName: contacts[elem].familyName,
          thumbnailPath: contacts[elem].hasThumbnail
            ? contacts[elem].thumbnailPath
            : null,
        });
      }
    }
    // console.log("renderUsers", renderUsers);
    return renderUsers;
  }

  useFocusEffect(
    React.useCallback(() => {
      FGLocationRetriever.getInstance().setOnPhonesLocationsListener(
        onUsersLocationUpdate
      );

      FGLocationRetriever.getInstance().startListeningToLocationUpdates();

      async function getCounter() {
        const counter = await getObject("counter");
        setCounter(counter == null ? 0 : counter);
      }
      getCounter();

      // returned function will be called on component unmount
      return () => {
        FGLocationRetriever.getInstance().stopListeningToLocationUpdates();
      };
    }, [])
  );

  const requestLocation = () => {
    setLoading(true);
    setLocation([1, 1]);
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
        setLocation([newLocation.longitude, newLocation.latitude]);
      })
      .catch((ex) => {
        if (ex instanceof LocationError) {
          const { code, message } = ex;
          console.warn(code, message);
          setError(code);
        } else {
          console.warn(ex);
        }
        setLocation((prev) => prev);
        setLoading(false);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LinearGradient
        style={{
          height: height * 0.14,
          width: "100%",
          paddingTop: height * 0.075,
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
          friendsCounter={`${counter ? counter : "0"} friends`}
          navigation={navigation}
          noBackButton
        />
      </LinearGradient>
      <View style={{ height: height * 0.86, width: "100%" }}>
        <Mapbox.MapView
          style={{ ...StyleSheet.absoluteFillObject }}
          //  styleURL={"mapbox://styles/mapbox/satellite-v9"}
          // onPress={(feature) =>
          //   console.log("Coords:", feature.geometry.coordinates)
          // }
        >
          <Mapbox.Camera
            followZoomLevel={5}
            zoomLevel={15}
            centerCoordinate={location}
            // Coachella
            // here
            animationDuration={1000}
          />
          <Mapbox.ShapeSource
            id="coachellaOverlay"
            shape={coachellaOverlayData}
          >
            <Mapbox.FillLayer
              id="coachellaOverlayFill"
              style={{ fillColor: "#ff6600", fillOpacity: 0.5 }}
            />
            <Mapbox.LineLayer
              id="coachellaOverlayLine"
              style={{ lineColor: "#ff6600", lineWidth: 2 }}
            />
            <Mapbox.SymbolLayer
              id="coachellaOverlaySymbol"
              style={{
                textField: ["get", "stageName"],
                textSize: 8,
                textOffset: [0, 1],
                textJustify: "center",
                textAnchor: "center",
                textFont: ["Open Sans Bold"],
                textPadding: 5,
                textAllowOverlap: true,
                textIgnorePlacement: true,
              }}
            />
          </Mapbox.ShapeSource>

          {location[0] !== -116.23774063311555 &&
            location[1] !== 33.68024422721021 && (
              <Mapbox.MarkerView coordinate={location}>
                <UserMarker />
              </Mapbox.MarkerView>
            )}

          {renderUsers?.map((user, index) => (
            <Mapbox.MarkerView
              coordinate={user?.coordinates}
              key={user?.phone}
              id={user?.phone}
            >
              <FriendMarker contact={user} setUserToPush={setUserToPush} setVisible={setVisible}/>
            </Mapbox.MarkerView>
          ))}
          {/* <Mapbox.UserLocation showsUserHeadingIndicator={true} /> */}
        </Mapbox.MapView>
      </View>
      <TouchableOpacity
        style={{ position: "absolute", left: 10, bottom: 58 }}
        onPress={() => navigation.push("ContactsStack")}
      >
        <AssetImage
          asset={Assets.addUser}
          width={normalize(90)}
          height={normalize(91)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ position: "absolute", right: 10, bottom: 58 }}
        onPress={requestLocation}
      >
        <AssetImage
          asset={Assets.userPosition}
          width={normalize(90)}
          height={normalize(91)}
        />
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={{
          position: "absolute",
          right: 10,
          bottom: 58,
          // zIndex: 1,
          // backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AssetImage
          asset={Assets.emrgButton}
          // asset={Assets.userPosition}
          width={normalize(90)}
          height={normalize(91)}
        />
        {Platform.OS === "android" && (
          <AssetImage
            asset={Assets.whiteBell}
            stroke={"black"}
            containerStyle={{ position: "absolute" }}
            // asset={Assets.userPosition}
            width={normalize(32)}
            height={normalize(32)}
          />
        )}
      </TouchableOpacity> */}
      {visible && <OverlayScreen setVisible={setVisible} userToPush={userToPush}/>}
    </View>
  );
};

export default Map;
