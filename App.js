import React, { useEffect } from "react";
import store from "./src/store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Provider } from "react-redux";
import RootNavigator from "./src/navigators/RootNavigator";
import OverlayScreen from "./src/screens/overlay/OverlayScreen";
import { initMirageJs } from "./src/network/mirage";
import { autoLoginUser, checkFirstLaunch } from "./src/store/slices/AuthSlice";
import { LavStatusBar } from "./src/components/lav.status_bar";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { ToastConfig } from "./src/components/lav.toast_config";
import { Strings } from "./src/utils/Localizations";

window.server = initMirageJs(window.server);

const App = () => {
  useEffect(() => {
    store.dispatch(checkFirstLaunch());
    store.dispatch(autoLoginUser({}));
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
      <LavStatusBar />
      <BottomSheetModalProvider>
        <RootNavigator />
      </BottomSheetModalProvider>
      <Toast config={ToastConfig} />

      <OverlayScreen />
    </Provider>
  );
};

export default App;
