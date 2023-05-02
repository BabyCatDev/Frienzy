// import { userAPI } from '../services/user';
// import authReducer from '../slices/authSlice';
// import overlaySlice from "../slices/OverlaySlice";
// import { configureStore } from '@reduxjs/toolkit';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     [userAPI.reducerPath]: userAPI.reducer,
//     overlay: overlaySlice,
//   },
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userAPI.middleware),
// });


import { createStore, combineReducers } from 'redux';
import authReducer from '../reducers/authReducer';
import dataReducer from '../reducers/dataReducer';
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const rootReducer = combineReducers(
  {
    FrienzyAuth: authReducer,
    FrienzyData: dataReducer,
  }
);

const configureStore = () => {
  return createStore(rootReducer, applyMiddleware(thunk));
}

export default configureStore;
