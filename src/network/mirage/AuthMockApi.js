import {Response} from "miragejs";
import {FETCH_USER_ENDPOINT, LOGIN_USER_ENDPOINT, USER_PIN_ENDPOINT} from "../Constants";

const mockUserModel = {
  id: 0,
  name: "",
  email: "",
};

const mockUserLoginPayload = {
  user: mockUserModel,
  token: "123",
};

export default AuthMockApi = (routes) => {

  routes.post(LOGIN_USER_ENDPOINT, (schema, request) => {
    try {
      const {login, password} = JSON.parse(request.requestBody);

      if (login === "test" && password === "test") {
        return new Response(200, {}, mockUserLoginPayload);
      } else {
        return new Response(
          401,
          {},
          {
            error: "Invalid credentials",
          },
        );
      }
    } catch (e) {
      return new Response(
        400,
        {},
        {
          error: "Invalid request",
        },
      );
    }
  });

  routes.post(FETCH_USER_ENDPOINT, (schema, request) => {
    try {
      const {token} = JSON.parse(request.requestBody);

      if (token === mockUserLoginPayload.token) {
        return new Response(200, {}, mockUserModel);
      } else {
        return new Response(
          401,
          {},
          {
            error: "Invalid token",
          },
        );
      }
    } catch (e) {
      return new Response(
        400,
        {},
        {
          error: "Invalid request",
        },
      );
    }
  });

  routes.post(USER_PIN_ENDPOINT, (schema, request) => {
    try {
      const {token, pin} = JSON.parse(request.requestBody);

      if (token === "123") {
        if (pin === "1234") {
          return new Response(200, {}, {});
        }
        return new Response(402, {}, {error: "Invalid pin"});
      } else {
        return new Response(
          401,
          {},
          {
            error: "Invalid token",
          },
        );
      }
    } catch (e) {
      return new Response(
        400,
        {},
        {
          error: "Invalid request",
        },
      );
    }
  });
};
