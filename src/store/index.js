import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import overlaySlice from "./slices/OverlaySlice";
import ordersSlice from "./slices/OrdersSlice";

export default store = configureStore({
  reducer: {
    auth: authReducer,
    overlay: overlaySlice,
    orders: ordersSlice,
  },
});
