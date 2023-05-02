import React, { useEffect } from "react";
import configureStore from './src/redux/store/configureStore';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Provider } from "react-redux";
import NavigationManager from "./src/navigation/NavigationManager";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { ToastConfig } from "./src/components/toastConfig";
import { StatusBar } from "react-native";
import AuthProvider from "./src/utils/AuthProvider";
import FGLocationRetriever from "./src/services/FGLocationRetriever";
import OneSignal from "react-native-onesignal";
import FBSaver from "./src/services/FBSaver";
// OneSignal Initialization
OneSignal.setAppId("146aaecb-a485-4ccd-82b7-5f154569d9c8");

// promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
OneSignal.promptForPushNotificationsWithUserResponse();

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(
  (notificationReceivedEvent) => {
    console.log(
      "OneSignal: notification will show in foreground:",
      notificationReceivedEvent
    );
    let notification = notificationReceivedEvent.getNotification();
    console.log("notification: ", notification);
    const data = notification.additionalData;
    console.log("additionalData: ", data);
    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
  }
);

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler((notification) => {
  console.log("OneSignal: notification opened:", notification);
});

// window.server = initMirageJs(window.server);

const store2 = configureStore()

const App = () => {
  const fetchCredentials = async () => {
    const key = FBSaver.getInstance().userKey;
    const phone = FBSaver.getInstance().keyToPhone[key];
    const token = await AuthProvider.getToken(phone, "111111");

    if (token) {
      store.dispatch(autoLoginUser(token));
    } else {
      store.dispatch(setAutoLoginLoading(false));
    }
  };

  useEffect(() => {
    async function appStart() {
      FBSaver.getInstance().init();
      await store.dispatch(checkFirstLaunch());
      fetchCredentials();
      FGLocationRetriever.getInstance().init();
    }
    appStart();
  }, []);

  return (
    <Provider store={store2}>
        <StatusBar barStyle="light-content" backgroundColor={"#1A1822"} />
        <BottomSheetModalProvider>
          <NavigationManager />
        </BottomSheetModalProvider>
        <Toast config={ToastConfig} />
    </Provider>
  );
};

export default App;


//        <OverlayScreen />