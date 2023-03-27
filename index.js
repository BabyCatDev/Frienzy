/**
 * @format
 */

import {AppRegistry} from "react-native";
import App from "./App";
import {name as appName} from "./app.json";
import AuthProvider from "./src/utils/AuthProvider";

AuthProvider.init();
AppRegistry.registerComponent(appName, () => App);
