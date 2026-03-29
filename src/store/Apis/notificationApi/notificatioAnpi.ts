import { baseApi } from "@/store/Apis/baseApi";

export interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  status: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  role?: string;
}

export interface NotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  meta: NotificationMeta;
  data: NotificationItem[];
}

export interface NotificationQuery {
  page?: number;
  limit?: number;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query<NotificationResponse, NotificationQuery | void>(
      {
        query: (params) => ({
          url: "/notification/admin-all",
          method: "GET",
          params: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 10,
          },
        }),
        providesTags: (result) =>
          result?.data
            ? [
                ...result.data.map(({ _id }) => ({
                  type: "Notifications" as const,
                  id: _id,
                })),
                { type: "Notifications", id: "LIST" },
              ]
            : [{ type: "Notifications", id: "LIST" }],
      },
    ),
    markAllAsRead: builder.mutation<NotificationResponse, void>({
      query: () => ({
        url: "/notification/all-read",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
    markAsRead: builder.mutation<NotificationResponse, string>({
      query: (id) => ({
        url: `/notification/read/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Notifications", id },
        { type: "Notifications", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} = notificationApi;
