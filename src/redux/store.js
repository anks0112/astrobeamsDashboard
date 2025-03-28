import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local storage
import { combineReducers } from "redux";
import { thunk } from "redux-thunk";

import allAstrologersReducers from "./slices/fetchAllAstrologers";
import createAstrologerReducers from "./slices/createAstrologer";
import allBlogsReducers from "./slices/allBlogs";
import allUserReducers from "./slices/allUsers";
import allBannersReducers from "./slices/allBanners";
import authSliceReducers from "./slices/authSlice";
import earningReducers from "./slices/earnings";

// Persist Config
const persistConfig = {
  key: "root",
  storage,
};

// Combine Reducers
const rootReducer = combineReducers({
  allAstrologers: allAstrologersReducers,
  createAstrologer: createAstrologerReducers,
  allBlogs: allBlogsReducers,
  allUsers: allUserReducers,
  allBanners: allBannersReducers,
  authSlice: authSliceReducers,
  earnings: earningReducers,
});

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🚀 Fix: `middleware` must be a function
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunk),
});

export const persistor = persistStore(store);
