import { configureStore } from "@reduxjs/toolkit";

// Placeholder reducer until you add slices (e.g. with createSlice).
// Replace or add reducers: reducer: { mySlice: mySlice.reducer }
const placeholderReducer = (state: Record<string, never> = {}) => state;

export const makeStore = () => {
  return configureStore({
    reducer: {
      _root: placeholderReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
