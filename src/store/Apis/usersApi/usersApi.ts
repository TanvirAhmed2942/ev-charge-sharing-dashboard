import { baseApi } from "../baseApi";

export interface UserListItem {
  _id: string;
  profile: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  isStripeConnectedAccount: boolean;
  adminComission: number;
  createdAt: string;
  updatedAt: string;
  location?: string;
  phone?: string;
  gender?: string;
}

export interface UsersListMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface GetAllUsersResponse {
  success: boolean;
  message?: string;
  meta: UsersListMeta;
  data: UserListItem[];
}

/** Single user as returned by getUserById */
export interface UserByIdData {
  _id: string;
  profile: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  isStripeConnectedAccount: boolean;
  adminComission: number;
  createdAt: string;
  updatedAt: string;
  totalBooking?: number;
  totalParkingSpace?: number;
  phone?: string;
}

export interface GetUserByIdResponse {
  success: boolean;
  message?: string;
  data: UserByIdData;
}

/** Params for paginated get all users. Reuse this shape for other list APIs. */
export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  /** Search by user (name/email). */
  searchTerm?: string;
  /** Filter by active status. */
  isActive?: boolean;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<GetAllUsersResponse, GetAllUsersParams | void>({
      query: (params) => {
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 10;
        const searchTerm = params?.searchTerm?.trim();
        const isActive = params?.isActive;
        return {
          url: "/users/all-users",
          method: "GET",
          params: {
            page,
            limit,
            ...(searchTerm && { searchTerm }),
            ...(typeof isActive === "boolean" && { isActive }),
          },
        };
      },
      providesTags: (result) =>
        result
          ? [
              "Users",
              ...result.data.map(({ _id }) => ({
                type: "Users" as const,
                id: _id,
              })),
            ]
          : ["Users"],
    }),
    getUserById: builder.query<GetUserByIdResponse, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Users", id }],
    }),
    blockUser: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/users/blocked/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
    unblockUser: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/users/blocked/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
} = usersApi;
