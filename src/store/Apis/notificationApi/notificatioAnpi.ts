import { baseApi } from "@/store/Apis/baseApi";

export interface NotificationItem {
  _id: string;
  userId: string;
  message: string;
  type: string;
  status: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface NotificationData {
  unReadCount: number;
  result: NotificationItem[];
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  meta: NotificationMeta;
  data: NotificationData;
}

export interface NotificationQuery {
  page?: number;
  limit?: number;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query<
      NotificationResponse,
      NotificationQuery | void
    >({
      query: (params) => {
        return {
          url: "/notification",
          method: "GET",
          params: params || { page: 1, limit: 10 },
        };
      },
      providesTags: ["Notification"],
    }),
    markAllAsRead: builder.mutation<NotificationResponse, void>({
      query: () => {
        return {
          url: "/notification/all-read",
          method: "POST",
        };
      },
      invalidatesTags: ["Notification"],
    }),
    markAsRead: builder.mutation<NotificationResponse, string>({
      query: (id) => {
        return {
          url: `/notification/read/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["Notification"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} = notificationApi;
