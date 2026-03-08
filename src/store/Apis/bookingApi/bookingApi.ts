import { baseApi } from "../baseApi";

export interface BookingUserId {
  _id: string;
  profile?: string;
  fullName?: string;
  email?: string;
  role?: string;
}

export interface BookingParkingPlaceId {
  _id: string;
  name?: string;
  locationAddress?: string;
}

export interface BookingResultItem {
  _id: string;
  userId: BookingUserId;
  parkingPlaceOwnerId: string;
  parkingPlaceId: BookingParkingPlaceId;
  bookingDate: string;
  startTime: string;
  endTime: string;
  amount: number;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface BookingsResponse {
  success: boolean;
  message?: string;
  data: {
    meta: BookingMeta;
    result: BookingResultItem[];
  };
}

export interface GetBookingsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<BookingsResponse, GetBookingsParams | void>({
      query: (params) => ({
        url: "/booking-parking-place",
        method: "GET",
        params: params ?? { page: 1, limit: 10 },
      }),
      providesTags: (result) =>
        result
          ? [
              "Bookings",
              ...result.data.result.map(({ _id }) => ({
                type: "Bookings" as const,
                id: _id,
              })),
            ]
          : ["Bookings"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetBookingsQuery } = bookingApi;
