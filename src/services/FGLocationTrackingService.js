// import  Permissions, { PERMISSIONS } from 'react-native-permissions';
// import database from '@react-native-firebase/database';

// import Crypto from 'react-native-quick-crypto'

import BackgroundGeolocation, { Location, Subscription } from 'react-native-background-geolocation';

export default class FGLocationTrackingService {
  static instance = null;
  static getInstance() {
    if (this.instance == null) {
      this.instance = new FGLocationTrackingService();
    }
    return this.instance;
  }

  constructor() {
    this.permissionGranted = false;

    this._BGonHeartbeat = this._BGonHeartbeat.bind(this);
    this.BGonLocation = this._BGonLocation.bind(this);
  }

  setOnLocationListener(listener) {
    this.onLocationListener = listener;
  }

  init() {
    BackgroundGeolocation.onLocation(this._BGonLocation.bind(this));

    BackgroundGeolocation.onHeartbeat(this._BGonHeartbeat);

    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      heartbeatInterval: 10,
      preventSuspend: true,
      stopTimeout: 5,

      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,
      startOnBoot: true,
      batchSync: false,
      autoSync: true,
    }).then((state) => {
      console.log('- BackgroundGeolocation is configured and ready: ', state.enabled);
    });
  }

  _BGonHeartbeat(event) {
    console.log('[onHeartbeat]', event.location.coords);
    if (this.onLocationListener) this.onLocationListener(event.location.coords);
  }

  _BGonLocation(event) {
    console.log('[onLocation]', event.coords);
    if (this.onLocationListener) this.onLocationListener(event.coords);
  }

  _onLocationPermissionGranted() {
    this.permissionGranted = true;
  }

  _onLocationPermissionDenied() {
    this.permissionGranted = false;
  }

  requestTrackingPermission() {
    BackgroundGeolocation.requestPermission(
      this._onLocationPermissionGranted,
      this._onLocationPermissionDenied
    );
  }

  startLocationTracking() {
    BackgroundGeolocation.start(
      this._onLocationPermissionGranted,
      this._onLocationPermissionDenied
    );
  }

  stopLocationTracking() {
    BackgroundGeolocation.stop();
  }
}

//   requestTrackingPermission() {
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
