// import React, { useState, useEffect } from "react";
// import { View, Text, Button, Image } from "react-native";
// import auth from "@react-native-firebase/auth";
// import SplashScreen from "../screens/splash/SplashScreen";
// import { useDispatch, useSelector } from "react-redux";
// import { GetAuthComponents } from "./AuthStack";
// import { GetMainAppComponents } from "./MainStack";
// import { GetOnboardingComponents } from "./OnboardingStack";
// import { getUserDetails } from "../services/firebase/user";
// import { setUserDetails } from "../redux/slices/authSlice";
// import { useGetCurrentUser } from "../redux/services/user";

// const NavigationManager = (props) => {

//   const [loading, setLoading] = useState(true);
//   //const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState();
//   const { data, isSuccess, isLoading } = useGetCurrentUser()
//   const userDetails = useSelector(state => state.auth.userDetails);
//   const currentUserUID = useSelector(state => state.auth.currentUserUID);

//   const dispatch = useDispatch();

//   // Handle user state changes
//   // function onAuthStateChanged(userIn) {
//   //   setUser(userIn)
//   //   if (initializing) setInitializing(false);
//   // }

//   useEffect(() => {
//     //console.log("DATA CHANGED", data, isSuccess, isLoading)
//     isSuccess && dispatch(setUserDetails(data))
//   }, [data, isSuccess, isLoading])

//   useEffect(() => {
//     setLoading(false)
//     // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     // return subscriber; // unsubscribe on unmount
//   }, []);

//   // if (initializing) return null;

//   if (isLoading || loading) {
//     return <SplashScreen />
//   }

//   if (!data || !data.loggedIn) {
//     return (
//         <View style={{ flex: 1, backgroundColor: "#fff"}}>
//             <GetAuthComponents />
//         </View>
//     )
//   } else if (!data.profileCompleted) {
//     return (
//       <View style={{ flex: 1, backgroundColor: "#fff" }}>
//         <GetOnboardingComponents />
//       </View>
//     );
//   } else {
//     return (
//         <View style={{ flex: 1, backgroundColor: "#fff"}}>
//             <GetMainAppComponents />
//         </View>
//     )
//   }

// }

// export default NavigationManager;

import React, { useEffect } from 'react'
import { View } from "react-native";
import SplashScreen from "../screens/splash/SplashScreen";
import { useDispatch, useSelector } from 'react-redux'
import { userAuthStateListener } from '../redux/actions/data/UserDetails';
import { NavigationContainer } from '@react-navigation/native';
import { GetAuthComponents } from "./AuthStack";
import { GetMainAppComponents } from "./MainStack";
import { GetOnboardingComponents } from "./OnboardingStack";

const NavigationManager = (props) => {
    const currentUserObj = useSelector(state => state.FrienzyAuth)

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userAuthStateListener());
    }, [])

    if (!currentUserObj.loaded) {
        return <SplashScreen />
    }

    return (
        <NavigationContainer>
          <View style={{ flex: 1, backgroundColor: "#fff"}}>
          {currentUserObj.userDetails == null || currentUserObj.userDetails?.loggedIn == false ? (
              <GetAuthComponents />
          ) : !currentUserObj.userDetails.profileCompleted ? (
              <GetOnboardingComponents />
          ) : (
            <GetMainAppComponents />
          )}
          </View>
        </NavigationContainer>
    )
}

export default NavigationManager;