import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";

import userSlice from "./slices/userSlice/userSlice";
import bookingCountsReducer from "./slices/bookingCountsSlice/bookingCountsSlice";
import parkingCountsReducer from "./slices/parkingCountsSlice/parkingCountsSlice";

import { baseApi } from "./Apis/baseApi";

// Combine reducers
const rootReducer = combineReducers({
  user: userSlice,
  bookingCounts: bookingCountsReducer,
  parkingCounts: parkingCountsReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

// Create store (works on both server and client)
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
