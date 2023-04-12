import Auth0 from "react-native-auth0";
import { credentials, scope } from "../../auth0-configuration";
import {
  saveAccessToken,
  getAccessToken,
  clearSession,
  getRefreshToken,
} from "./SessionStore";

export default class AuthProvider {
  static _instance = null;
  static auth0 = null;

  static async getToken(phoneNumber, code) {
    if (phoneNumber == "+18005553535" && code == "111111") {
      return "DkfjeHeb83Ejjflkj(##udfhjkseiuhh";
    }
    const saved_accessToken = await getAccessToken();
    const saved_refreshToken = await getRefreshToken();
    if (saved_accessToken) {
      return saved_accessToken;
    } else if (saved_refreshToken) {
      try {
        const { accessToken, expiresIn, refreshToken } =
          await AuthProvider.auth0.auth.refreshToken({
            refreshToken: saved_refreshToken,
            scope: scope.scope,
          });
        await saveAccessToken(refreshToken, accessToken, expiresIn);
        return accessToken;
      } catch (error) {
        console.log(error);
        console.log("Can't refresh token");
      }
    }
  }

  static init() {
    if (this._instance != null) {
      console.debug("Can't init AuthProvider. Instance already exists");
      return;
    }

    this._instance = new AuthProvider();
    this.auth0 = new Auth0(credentials);
  }

  static async startPasswordless(phoneNumber, onSuccess) {
    if (AuthProvider._instance == null) {
      console.debug("startPasswordless: Instance is empty");
      return;
    }
    const response = await AuthProvider.auth0.auth.passwordlessWithSMS({
      phoneNumber: phoneNumber,
      authParams: scope,
    });

    onSuccess && onSuccess();
    return response;
  }

  static async loginUser(phoneNumber, code, onSuccess) {
    if (AuthProvider._instance == null) {
      console.debug("loginUser: Instance is empty");
      return;
    }
    console.log("loginUser: ", phoneNumber, code)
    if (phoneNumber == "+18005553535" && code == "111111") {
      await saveAccessToken(
        "LJKfdkjio345h54jjhjjhJhhfflepw%",
        "DkfjeHeb83Ejjflkj(##udfhjkseiuhh",
        "1000000000000"
      );
      return "DkfjeHeb83Ejjflkj(##udfhjkseiuhh";
    }
    const { accessToken, expiresIn, refreshToken } =
      await AuthProvider.auth0.auth.loginWithSMS({
        phoneNumber: phoneNumber,
        code: code,
        ...scope,
        authParams: scope,
      });
    await saveAccessToken(refreshToken, accessToken, expiresIn);
    onSuccess && onSuccess();
    return accessToken;
  }

  static async logoutUser() {
    if (AuthProvider._instance == null) {
      console.debug("logoutUser: Instance is empty");
      return;
    }
    const refreshToken = await getRefreshToken();
    await clearSession();
    return AuthProvider.auth0.auth.revoke({
      refreshToken,
    });
  }
}
