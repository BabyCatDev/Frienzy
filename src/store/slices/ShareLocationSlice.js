import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeSharedLocation = createAsyncThunk(
  "shareLocationSlice/storeSharedLocation",
  async (shareLocation) => {
    try {
        const jsonValue = JSON.stringify(shareLocation)
        await AsyncStorage.setItem('shareLocation', jsonValue)
        console.log(jsonValue, "jsonValue stored")
      } catch (e) {
        console.log(e)
      }
  }
);

const initialState = {
  shareLocations: {},
};

const shareLocationSlice = createSlice({
  name: "shareLocationSlice",
  initialState,
  reducers: {
    addShareLocation(state, action) {
      state.shareLocations[action.payload.recordID] = action.payload.permit;
    //   console.log(state.shareLocations, "state.shareLocations");
    },
  },
  extraReducers: (builder) => {},
});

export const { addShareLocation } = shareLocationSlice.actions;

export default shareLocationSlice.reducer;
