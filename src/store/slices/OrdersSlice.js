import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import {
  fetchComponentsApiCall,
  fetchFloristsApiCall,
  fetchOrdersApiCall,
} from "../../network";

export const fetchOrders = createAsyncThunk(
  "ordersSlice/fetchOrders",
  async (params, thunkApi) => {
    const token = thunkApi.getState().auth.token;
    try {
      params = params || {};
      const response = await fetchOrdersApiCall({ token, ...params });
      return response;
    } catch (e) {
      return thunkApi.rejectWithValue(e.response.data.error);
    }
  }
);

const initialState = {
  list: [],
  searchOrderList: [],
  isLoading: false,
  error: "",
  orderId: "",
};

const ordersSlice = createSlice({
  name: "ordersSlice",
  initialState,
  reducers: {
    setSearchOrders: (state, action) => {
      const searchOrder = state.list.filter(
        (order) =>
          order.id.toString().includes(action.payload.toString()) ||
          order.user.phone === action.payload.toString()
      );

      return {
        ...state,
        searchOrderList:
          action.payload.length > 0 ? searchOrder : [...state.list],
      };
    },
    onOrderClick: (state, action) => {
      return {
        ...state,
        orderId: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.list = action.payload.orders.sort((a, b) =>
        moment(a.timeFrom).isBefore(b.timeFrom) ? 1 : -1
      );
      state.searchOrderList = [...action.payload.orders];
      state.isLoading = false;
    });
    builder.addCase(fetchOrders.pending, (state, action) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.list = [];
      state.error = action.error.message;
    });
  },
});

export const { setSearchOrders, onOrderClick } = ordersSlice.actions;
export default ordersSlice.reducer;
