import Auth0 from "react-native-auth0";
import config from "../../auth0-configuration"

export const auth0 = new Auth0({
  domain: config.domain,
  clientId: config.clientId,
});

export const getCode = (phoneNumber, onSuccess) => {
  auth0.auth
    .passwordlessWithSMS({
      phoneNumber: phoneNumber,
      authParams: {
        scope: "openid profile email address phone offline_access",
      }
    })
    .then((response) => {
      console.log(response);
      onSuccess && onSuccess();
    })
    .catch(console.error);
};

export const loginUser = (phoneNumber, code, onSuccess) => {
    auth0.auth
      .loginWithSMS({
        phoneNumber: phoneNumber,
        code: code
      })
      .then((response) => {
        console.log(response);
        onSuccess && onSuccess();
      })
      .catch(console.error);
  }