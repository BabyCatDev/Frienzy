import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import overlaySlice from "./slices/OverlaySlice";
import ordersSlice from "./slices/OrdersSlice";
import ShareLocationSlice from "./slices/ShareLocationSlice";

export default store = configureStore({
  reducer: {
    auth: authReducer,
    overlay: overlaySlice,
    orders: ordersSlice,
    shareLocation: ShareLocationSlice,
  },
});
