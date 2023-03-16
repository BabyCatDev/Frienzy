import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUserInfoApiCall, loginUserApiCall } from "../../network";

export const loginUser = createAsyncThunk(
  "authSlice/loginUser",
  async ({ login, password }, thunkApi) => {
    try {
      const response = await loginUserApiCall({ login, password });
      return response;
    } catch (e) {
      return thunkApi.rejectWithValue(e.response.data.error);
    }
  }
);

export const checkFirstLaunch = createAsyncThunk(
  "authSlice/checkFirstLaunch",
  async () => {
    const value = await AsyncStorage.getItem("appLaunched");
    return { isFirstLaunch: value === null };
  }
);

export const autoLoginUser = createAsyncThunk(
  "authSlice/autoLoginUser",
  async ({}, thunkApi) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetchUserInfoApiCall({ token });
      return { user: response, token };
    } catch (e) {
      return thunkApi.rejectWithValue("");
    }
  }
);

const initialState = {
  user: {},
  token: "",
  isLoading: false,
  pin: "",
  isFirstLaunch: false,
  error: "",
  autoLoginLoading: false,
  address: "Мастерская “Ленина,14”",
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    storePhone: (state, action) => {
      return {
        ...state,
        user: {
          phone: action.payload.phoneNumber,
        },
      };
    },
    logout: (state, action) => {
      AsyncStorage.removeItem("token");
      return initialState;
    },
    setPin: (state, action) => {
      state.pin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      AsyncStorage.setItem("token", action.payload.token);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
    });
    builder.addCase(loginUser.pending, (state, action) => {
      state.isLoading = true;
      state.error = "";
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(autoLoginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.autoLoginLoading = false;
    });
    builder.addCase(autoLoginUser.pending, (state, action) => {
      state.isLoading = true;
      state.error = "";
      state.autoLoginLoading = true;
    });
    builder.addCase(autoLoginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.autoLoginLoading = false;
    });

    builder.addCase(checkFirstLaunch.fulfilled, (state, action) => {
      state.isFirstLaunch = action.payload.isFirstLaunch;
    });
  },
});

export const { logout, setPin, storePhone } = authSlice.actions;

export default authSlice.reducer;
