import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUserInfoApiCall, loginUserApiCall } from "../../network";
import AuthProvider from "../../utils/AuthProvider";
import FBSaver from "../../services/FBSaver";

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
    const key = FBSaver.getInstance().userKey;
    const phone = FBSaver.getInstance().keyToPhone[key];
    if (value === null) {
      const token = await AuthProvider.getToken(phone, '111111');
      if (token != "" && token != undefined) {
        await AuthProvider.logoutUser();
      }
    }
    return {
      isFirstLaunch: value === null,
      token: "",
      firstScreenRender: value === null,
      // autoLoginLoading: true
    };
  }
);

export const setFirstLaunch = createAsyncThunk(
  "authSlice/setFirstLaunch",
  async () => {
    await AsyncStorage.setItem("appLaunched", "false");
    return { isFirstLaunch: false };
  }
);

// export const setFirstScreenRender = createAsyncThunk(
//   "authSlice/setFirstScreenRender",
//   async () => {
//     await AsyncStorage.setItem("appLaunched", "false");
//     return { isFirstLaunch: false };
//   }
// );

export const autoLoginUser = createAsyncThunk(
  "authSlice/autoLoginUser",
  async (token, thunkApi) => {
    try {
      // const token = await AsyncStorage.getItem("token");

      // const response = await fetchUserInfoApiCall({ token });
      return { user: {}, token };
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
  firstScreenRender: false,
  error: "",
  autoLoginLoading: true,
  address: "Мастерская “Ленина,14”",
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    logout: (state, action) => {
      return {...initialState, autoLoginLoading: false};
    },
    setPin: (state, action) => {
      state.pin = action.payload;
    },
    setAutoLoginLoading: (state, action) => {
      state.autoLoginLoading = action.payload;
    },
    setFirstScreenRender: (state) => {
      state.firstScreenRender = false;
    }
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
    builder.addCase(setFirstLaunch.fulfilled, (state, action) => {
      state.isFirstLaunch = action.payload.isFirstLaunch;
    });
  },
});

export const { logout, setPin, setAutoLoginLoading } = authSlice.actions;

export default authSlice.reducer;
