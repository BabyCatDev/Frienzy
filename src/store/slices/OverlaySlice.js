import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    onShow: false,
    title: "",
    description: "",
    actions: [],
    navigation: null,
};

const overlaySlice = createSlice({
  name: "overlaySlice",
  initialState,
  reducers: {
    showOverlay(state, action) {
        state.onShow = true,
        state.title = action.data.title
    },
    hideOverlay(state, action) {
        state.onShow = false
        state.navigation = null
    }
  },
  extraReducers: builder => {},
});

export const { showOverlay, hideOverlay } = overlaySlice.actions

export default overlaySlice.reducer;