import { baseApi } from "@/store/Apis/baseApi";

export interface MyRequestItem {
  _id: string;
  typeUser: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  pharmacyName: string;
  email: string;
  phone: string;
  legalName: string;
  dateOfBirth: string;
  amount: number;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface MyRequestsMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface MyRequestsResponse {
  success: boolean;
  message?: string;
  meta: MyRequestsMeta;
  data: MyRequestItem[];
}

export interface MyRequestsQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
}

export const myRequestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyRequests: builder.query<MyRequestsResponse, MyRequestsQuery | void>({
      query: (params) => {
        return {
          url: "/prescription-order/user",
          method: "GET",
          params: params || { page: 1, limit: 10 },
        };
      },
      providesTags: ["MyRequests"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetMyRequestsQuery } = myRequestsApi;
