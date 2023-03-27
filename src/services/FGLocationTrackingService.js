// import BackgroundTimer from 'react-native-background-timer';
// import GetLocation from 'react-native-get-location'
// import  Permissions, { PERMISSIONS } from 'react-native-permissions';
// import database from '@react-native-firebase/database';

// import Crypto from 'react-native-quick-crypto'

// import BackgroundGeolocation, {
//     Location,
//     Subscription
//   } from "react-native-background-geolocation";

// export default class FGLocationTrackingService {
//   constructor(phoneNumber, locationTrackingInterval) {
//     this.phoneNumber = phoneNumber;
//     this.locationTrackingInterval = locationTrackingInterval;
//   }

//   permissionGranted = true;

//     requestTrackingPermission() {
//         Permissions.request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(response => {
//             console.log(response);
//             if (response == "granted") {
//                 this.permissionGranted = true;
//             } else {
//                 this.permissionGranted = false;
//             }
//         });
//     }

//     trackLocation() {
//         GetLocation.getCurrentPosition({
//             enableHighAccuracy: true,
//             timeout: 60000,
//         })
//         .then(location => {
//             console.log(location);
//         })
//         .catch(error => {
//             const { code, message } = error;
//             console.warn(code, message);
//             console.log("WTFFFFF")
//         })
//     }

//     stopLocationTracking() {
//         BackgroundTimer.stopBackgroundTimer();
//     }

//     async sendDataToFirebase(location) {
//         // key is last 8 digits of phone number with sha1 hash
//         const key = Crypto.createHash('sha256')
//             .update(this.phoneNumber.substring(this.phoneNumber.length - 8))
//             .digest('hex')

//         console.log(key);
//         // get sha1 of key

//         //const reference = database().ref('/users/'+);
//     }

//     async startLocationTracking() {
//         console.log("startLocationTracking");
//         if (!this.permissionGranted) {
//             console.log("startLocationTracking: permission not granted");
//             this.requestTrackingPermission();
//             return;
//         }

//         this.sendDataToFirebase(undefined);
        
//         console.log("startLocationTracking: permission granted");

//         const onLocation = BackgroundGeolocation.onLocation((location) => {
//             console.log('[onLocation]', location.coords);
//           });

//           BackgroundGeolocation.onHeartbeat((event) => {
//             console.log('[onHeartbeat]', event.location.coords);
//             });



//           BackgroundGeolocation.ready({
//             // Geolocation Config
//             desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
//             distanceFilter: 0,
//             heartbeatInterval: 10,
//             disableElasticity: true,
//             preventSuspend: true,

//             // Activity Recognition
//             stopTimeout: 5,
//             // Application config
//             debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
//             logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
//             stopOnTerminate: true,   // <-- Allow the background-service to continue tracking when user closes the app.
//             startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
//             batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
//             autoSync: false,         // <-- [Default: true] Set true to sync each location to server as it arrives.
//           }).then((state) => {
//             console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);
//           });

//           BackgroundGeolocation.start();
//     }
  
// }