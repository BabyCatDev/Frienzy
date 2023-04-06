import React, { useEffect, useState } from "react";
import { View, StyleSheet, useWindowDimensions, Pressable } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { shapeSource } from '@rnmapbox/maps'
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
//this is my personal access token, you can use your own, I think it's tied to my secret token which is hardcoded to my environment
Mapbox.setAccessToken(
  "pk.eyJ1Ijoic29jaWFsbmF2IiwiYSI6ImNsZXB2N2g4aTBhOWQzenE2ZTcxdmxlOGoifQ.HL3LG1DJoVRYTZGH9nsOmA"
);
const Map = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [counter, setCounter] = useState();
  const { allowedContacts } = useSelector((state) => state.auth);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);

  const onStagePress = (stage) => {
    setSelectedStage(stage.id);
  };

  const renderStages = () => {
    return stages.map((stage) => {
      const isSelected = selectedStage === stage.id;
      const fillColor = isSelected ? '#00FF00' : '#0000FF';

      return (
        <Mapbox.ShapeSource
          key={stage.id}
          id={stage.id}
          shape={{
            type: 'Point',
            coordinates: stage.coordinates
          }}
        >
          <Mapbox.CircleLayer
            id={`${stage.id}-circle`}
            style={{
              circleColor: fillColor,
              circleRadius: 10
            }}
          />
          <Mapbox.SymbolLayer
            id={`${stage.id}-label`}
            style={{
              textField: stage.stageName,
              textSize: 12,
              textOffset: [0, 1],
              textAnchor: 'top'
            }}
          />
        </Mapbox.ShapeSource>
      );
    });
  };




  const onUsersLocationUpdate = (locations) => {
    setUsers(
      locations.map((location) => {
        return {
          phone: location.phone,
          coordinates: [location.long, location.lat],
          date: location.date,
        };
      })
    );
  };
  useFocusEffect(
    React.useCallback(() => {
      FGLocationRetriever.getInstance().setOnPhonesLocationsListener(
        onUsersLocationUpdate
      );

      FGLocationRetriever.getInstance().startListeningToLocationUpdates();

      async function getCounter() {
        const counter = await getObject("counter");
        setCounter(counter == null? 0 : counter);
      }
      getCounter();
      
      // returned function will be called on component unmount 
      return () => {
        FGLocationRetriever.getInstance().stopListeningToLocationUpdates();
      };
    }, [])
  );

  useEffect(() => {
    requestLocation();
  }, []);


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

  // useEffect(() => {
  //   async function getCounter() {
  //     const counter = await getData("counter");
  //     const contacts = await getContacts("contacts");
  //     setContacts(contacts);
  //     setCounter(counter);
  //   }
  //   getCounter();
  // }, []);




  const coachellaOverlayData = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "stageName": "Outdoor Theater"
        },
        "geometry": {
          "coordinates": [
            [
              [
                -116.23478772267595,
                33.68506348044788
              ],
              [
                -116.23433711156139,
                33.68469745417991
              ],
              [
                -116.23413326367637,
                33.68491171364822
              ],
              [
                -116.23446585759416,
                33.685170609792635
              ],
              [
                -116.23478772267595,
                33.68506348044788
              ]
            ]
          ],
          "type": "Polygon"
        },
        "id": 0
      },
      {
        "type": "Feature",
        "properties": {
          "stageName": "Dolab"
        },
        "geometry": {
          "coordinates": [
            [
              [
                -116.23931898848656,
                33.67920955530866
              ],
              [
                -116.23931898848656,
                33.678759837597894
              ],
              [
                -116.2384973983388,
                33.678759837597894
              ],
              [
                -116.2384973983388,
                33.67920955530866
              ],
              [
                -116.23931898848656,
                33.67920955530866
              ]
            ]
          ],
          "type": "Polygon"
        },
        "id": 4
      },
      {
        "type": "Feature",
        "properties": {
          "stageName": "Coachella Stage"
        },
        "geometry": {
          "coordinates": [
            [
              [
                -116.23932264864585,
                33.6849265227965
              ],
              [
                -116.23932264864585,
                33.68436137422853
              ],
              [
                -116.23783283184423,
                33.68436137422853
              ],
              [
                -116.23783283184423,
                33.6849265227965
              ],
              [
                -116.23932264864585,
                33.6849265227965
              ]
            ]
          ],
          "type": "Polygon"
        },
        "id": 5
      },
      {
        "type": "Feature",
        "properties": {
          "stageName": "Sahara"
        },
        "geometry": {
          "coordinates": [
            [
              [
                -116.24058379638569,
                33.678647190326714
              ],
              [
                -116.24058379638569,
                33.6795709860139
              ],
              [
                -116.24153533013839,
                33.6795709860139
              ],
              [
                -116.24153533013839,
                33.678647190326714
              ],
              [
                -116.24058379638569,
                33.678647190326714
              ]
            ]
          ],
          "type": "Polygon"
        },
        "id": 3
      },
      {
        "type": "Feature",
        "properties": {
          "stageName": "Mojave"
        },
        "geometry": {
          "coordinates": [
            [
              [
                -116.23634398720299,
                33.67941532827349
              ],
              [
                -116.23634398720299,
                33.67988664963272
              ],
              [
                -116.23731817652109,
                33.67988664963272
              ],
              [
                -116.23731817652109,
                33.67941532827349
              ],
              [
                -116.23634398720299,
                33.67941532827349
              ]
            ]
          ],
          "type": "Polygon"
        },
        "id": 6
      },
      {
        "type": "Feature",
        "properties": {
          "stageName": "Gobi"
        },
        "geometry": {
          "coordinates": [
            [
              [
                -116.23635531498569,
                33.68108379427012
              ],
              [
                -116.23718224312782,
                33.68108379427012
              ],
              [
                -116.23718224312782,
                33.680650184752224
              ],
              [
                -116.23635531498569,
                33.680650184752224
              ],
              [
                -116.23635531498569,
                33.68108379427012
              ]
            ]
          ],
          "type": "Polygon"
        },
        "id": 6
      },
      {
        "type": "Feature",
        "properties": {
          "stageName": "Sonora"
        },
        "geometry": {
          "coordinates": [
            [
              [
                -116.23633265941999,
                33.68139486062053
              ],
              [
                -116.23633265941999,
                33.681753056842396
              ],
              [
                -116.23705763751721,
                33.681753056842396
              ],
              [
                -116.23705763751721,
                33.68139486062053
              ],
              [
                -116.23633265941999,
                33.68139486062053
              ]
            ]
          ],
          "type": "Polygon"
        },
        "id": 6
      },
      {
        "type": "Feature",
        "properties": {
          "stageName": "Yuma"
        },
        "geometry": {
          "coordinates": [
            [
              [
                -116.24047862791328,
                33.680923547529304
              ],
              [
                -116.24047862791328,
                33.681545680264236
              ],
              [
                -116.24153211171085,
                33.681545680264236
              ],
              [
                -116.24153211171085,
                33.680923547529304
              ],
              [
                -116.24047862791328,
                33.680923547529304
              ]
            ]
          ],
          "type": "Polygon"
        },
        "id": 7
      }
    ]
  }

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
          friendsCounter={`${counter ? counter : '0'} friends`}
          navigation={navigation}
          noBackButton
        />
      </LinearGradient>
      <View style={{ height: height * 0.86, width: "100%" }}>
        <Mapbox.MapView
          style={{ ...StyleSheet.absoluteFillObject }}
          //  styleURL={"mapbox://styles/mapbox/satellite-v9"}
        >
          <Mapbox.Camera
            followZoomLevel={5}
            zoomLevel={18}
            // centerCoordinate={location ? [location.longitude, location.latitude] : null}
            centerCoordinate={[-116.23935536523643, 33.68370272168475]} Coachella here
            animationDuration={1000}/>
          <Mapbox.ShapeSource id="coachellaOverlay" shape={coachellaOverlayData}>
            <Mapbox.FillLayer
            id="coachellaOverlayFill"
             style={{fillColor: '#ff6600', fillOpacity: 0.5}}
            />
          <Mapbox.LineLayer
            id="coachellaOverlayLine"
            style={{lineColor: '#ff6600', lineWidth: 2}}
          />
          <Mapbox.SymbolLayer
      id="coachellaOverlaySymbol"
      style={{
      textField: ['get', 'stageName'],
      textSize: 8,
      textOffset: [0, 1],
      textJustify: 'center',
      textAnchor: 'center',
      textFont: ['Open Sans Bold'],
      textPadding: 5,
      textAllowOverlap: true,
      textIgnorePlacement: true,
    }}
  />
        </Mapbox.ShapeSource>
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
          <Mapbox.UserLocation
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
