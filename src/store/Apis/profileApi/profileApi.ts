import { baseApi } from "../baseApi";

interface GetProfileResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    profile: string;
    fullName: string;
    email: string;
    role: string;
    isActive: boolean;
    isDeleted: boolean;
    phone: string;
    isVerified: boolean;
    gender: string;
    isStripeConnectedAccount: boolean;
    adminComission: number;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}
interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
  };
  error?: string;
}
/** Only fullName, phone, and profile (file) are sent. Email is not updatable. */
export interface UpdateProfileRequest {
  fullName: string;
  phone: string;
  profileFile?: File;
}

export interface ActivityLogItem {
  _id: string;
  userId: {
    _id: string;
    profile?: string;
    email?: string;
    role?: string;
  };
  title: string;
  message: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetActivityLogResponse {
  success: boolean;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data?: ActivityLogItem[];
}

export interface UpdateCommissionRequest {
  admin_comission: number;
}
export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<GetProfileResponse, void>({
      query: () => {
        return {
          url: "/users/my-profile",
          method: "GET",
        };
      },
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (body) => {
        const formData = new FormData();
        formData.append("fullName", body.fullName);
        formData.append("phone", body.phone);
        if (body.profileFile) {
          formData.append("profile", body.profileFile);
        }
        return {
          url: "/users/update-my-profile",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Profile"],
    }),
    updateCommission: builder.mutation<
      GetProfileResponse,
      UpdateCommissionRequest
    >({
      query: (body) => ({
        url: "/users/update-comission",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateCommissionMutation,
} = profileApi;
