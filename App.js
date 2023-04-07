import React, { useEffect } from "react";
import store from "./src/store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Provider } from "react-redux";
import RootNavigator from "./src/navigators/RootNavigator";
import OverlayScreen from "./src/screens/overlay/OverlayScreen";
import { initMirageJs } from "./src/network/mirage";
import { autoLoginUser, checkFirstLaunch } from "./src/store/slices/AuthSlice";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { ToastConfig } from "./src/components/lav.toast_config";
import { Strings } from "./src/utils/Localizations";
import { StatusBar } from "react-native";
import AuthProvider from "./src/utils/AuthProvider";
import { setAutoLoginLoading } from "./src/store/slices/AuthSlice";
import FGLocationTrackingService from "./src/services/FGLocationTrackingService";
import FGLocationRetriever from "./src/services/FGLocationRetriever";
import OneSignal from 'react-native-onesignal';
// OneSignal Initialization
OneSignal.setAppId('146aaecb-a485-4ccd-82b7-5f154569d9c8');

// promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
OneSignal.promptForPushNotificationsWithUserResponse();

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
  console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
  let notification = notificationReceivedEvent.getNotification();
  console.log("notification: ", notification);
  const data = notification.additionalData
  console.log("additionalData: ", data);
  // Complete with null means don't show a notification.
  notificationReceivedEvent.complete(notification);
});

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  console.log("OneSignal: notification opened:", notification);
});




// window.server = initMirageJs(window.server);

const App = () => {
  const fetchCredentials = async () => {
    // store.dispatch(setAutoLoginLoading(true));
    const token = await AuthProvider.getToken();

    if (token) {
      store.dispatch(autoLoginUser(token));
    } 
    else {
      store.dispatch(setAutoLoginLoading(false));
    }
  };

  useEffect(() => {
    async function appStart() {
      await store.dispatch(checkFirstLaunch());
      fetchCredentials();
      FGLocationRetriever.getInstance().init();
    }
    appStart();
  }, []);

  useEffect(() => {
    if (Strings.getLanguage() == "ru") {
      Strings.setLanguage("ru");
    } else {
      Strings.setLanguage("en");
    }
  }, []);

  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor={"#1A1822"} />
      <BottomSheetModalProvider>
        <RootNavigator />
      </BottomSheetModalProvider>
      <Toast config={ToastConfig} />
      <OverlayScreen />
    </Provider>
  );
};

export default App;
