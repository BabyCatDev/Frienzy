import { createServer } from "miragejs";
import AuthMockApi from "./AuthMockApi";

import OrdersMockApi from "./OrdersMockApi";

export const initMirageJs = (server) => {
  if (server) {
    server.shutdown();
  }
  return createServer({
    routes() {
      AuthMockApi(this);
      OrdersMockApi(this);
    },
  });
};
