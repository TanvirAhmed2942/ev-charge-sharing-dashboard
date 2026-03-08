import { baseApi } from "../baseApi";

/** Legacy dashboard response type. */
export interface GetDashboardDataResponse {
  success?: boolean;
  data?: unknown;
}

export interface TopParkingPlaceItem {
  totalBookings: number;
  totalAmount: number;
  parkingPlaceId: string;
  parkingName: string;
}

export interface WeeklyMonthlyDataPoint {
  day: string;
  amount: number;
}

export interface WeeklyMonthlyBookingDataPoint {
  day: string;
  amount: number;
}

export interface DashboardOverviewData {
  totalRevenue: number;
  totalUsers: number;
  totalParkingPlace: number;
  totalBooking: number;
  topParkingPlace: TopParkingPlaceItem[];
  pendingNotification: number;
  weeklyMonthlyData: WeeklyMonthlyDataPoint[];
  weeklyMonthlyBookingData: WeeklyMonthlyBookingDataPoint[];
}

export interface DashboardOverviewResponse {
  success: boolean;
  message?: string;
  data: DashboardOverviewData;
}

export type RevenueStatus = "weekly" | "monthly";
export type BookingStatus = "weekly" | "monthly";

export interface GetDashboardOverviewParams {
  revenuestatus?: RevenueStatus;
  bookingstatus?: BookingStatus;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<GetDashboardDataResponse, void>({
      query: () => ({
        url: "/dashboard",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
    getDashboardOverview: builder.query<
      DashboardOverviewResponse,
      GetDashboardOverviewParams | void
    >({
      query: (params) => ({
        url: "/payment/overview",
        method: "GET",
        params: {
          revenuestatus: params?.revenuestatus ?? "monthly",
          bookingstatus: params?.bookingstatus ?? "weekly",
        },
      }),
      providesTags: ["Dashboard"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetDashboardDataQuery, useGetDashboardOverviewQuery } =
  dashboardApi;
