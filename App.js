import React, { useEffect } from 'react';
import configureStore from './src/redux/store/configureStore';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Provider } from 'react-redux';
import NavigationManager from './src/navigation/NavigationManager';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { ToastConfig } from './src/components/utils/toastConfig';
import { StatusBar } from 'react-native';
import AuthProvider from './src/utils/AuthProvider';
import { QueryClientProvider, QueryClient } from 'react-query';
//import OneSignal from 'react-native-onesignal';
import FBSaver from './src/services/FBSaver';
import messaging from '@react-native-firebase/messaging';
import { updateFcmToken } from './src/services/firebase/user';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
// OneSignal Initialization
// OneSignal.setAppId('146aaecb-a485-4ccd-82b7-5f154569d9c8');

// // promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
// // We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
// OneSignal.promptForPushNotificationsWithUserResponse();

// //Method for handling notifications received while app in foreground
// OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent) => {
//   console.log('OneSignal: notification will show in foreground:', notificationReceivedEvent);
//   let notification = notificationReceivedEvent.getNotification();
//   console.log('notification: ', notification);
//   const data = notification.additionalData;
//   console.log('additionalData: ', data);
//   // Complete with null means don't show a notification.
//   notificationReceivedEvent.complete(notification);
// });

// //Method for handling notifications opened
// OneSignal.setNotificationOpenedHandler((notification) => {
//   console.log('OneSignal: notification opened:', notification);
// });

// window.server = initMirageJs(window.server);

const store2 = configureStore();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      staleTime: Infinity,
    },
  },
});

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

const App = () => {
  const fetchCredentials = async () => {
    const key = FBSaver.getInstance().userKey;
    const phone = FBSaver.getInstance().keyToPhone[key];
    const token = await AuthProvider.getToken(phone, '111111');
  };

  useEffect(() => {
    async function appStart() {
      FBSaver.getInstance().init();
      fetchCredentials();
      await requestUserPermission();
      await updateFcmToken();
    }
    appStart();
  }, []);

  return (
    <Provider store={store2}>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="light-content" backgroundColor={'#1A1822'} />
        <BottomSheetModalProvider>          
          <ActionSheetProvider>
            <NavigationManager />
          </ActionSheetProvider>
        </BottomSheetModalProvider>
        <Toast config={ToastConfig} />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;

//        <OverlayScreen />
