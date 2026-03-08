import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface BookingCountsState {
  upcoming: number;
  ongoing: number;
  completed: number;
  declined: number;
}

const initialState: BookingCountsState = {
  upcoming: 0,
  ongoing: 0,
  completed: 0,
  declined: 0,
};

const bookingCountsSlice = createSlice({
  name: "bookingCounts",
  initialState,
  reducers: {
    setBookingCounts: (_, action: PayloadAction<BookingCountsState>) => {
      return action.payload;
    },
  },
});

export const { setBookingCounts } = bookingCountsSlice.actions;
export default bookingCountsSlice.reducer;
