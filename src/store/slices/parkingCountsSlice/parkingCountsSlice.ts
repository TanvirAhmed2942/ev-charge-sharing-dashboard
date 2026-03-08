import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ParkingCountsState {
  pending: number;
  approved: number;
  rejected: number;
}

const initialState: ParkingCountsState = {
  pending: 0,
  approved: 0,
  rejected: 0,
};

const parkingCountsSlice = createSlice({
  name: "parkingCounts",
  initialState,
  reducers: {
    setParkingCounts: (_, action: PayloadAction<ParkingCountsState>) => {
      return action.payload;
    },
  },
});

export const { setParkingCounts } = parkingCountsSlice.actions;
export default parkingCountsSlice.reducer;
