import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local storage
import { combineReducers } from "redux";
import thunk from "redux-thunk";

// Persist Config
const persistConfig = {
  key: "root",
  storage,
};

// Combine Reducers
const rootReducer = combineReducers({
  //   user: userReducer, // Add other reducers here
});

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk], // Add thunk middleware
});

export const persistor = persistStore(store);
