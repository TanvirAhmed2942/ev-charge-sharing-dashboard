import { baseApi } from "@/store/Apis/baseApi";

export interface PaymentUserId {
  _id: string;
  profile?: string;
  email?: string;
  role?: string;
}

export interface PaymentResultItem {
  _id: string;
  userId: PaymentUserId;
  method: string;
  totalAmount: number;
  ev_place_owner_amount: number;
  admin_commission_amount: number;
  status: string;
  transactionId: string;
  bookingParkingPlaceId: string;
  isRefund: boolean;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
  ev_place_owner_id: string;
}

export interface PaymentMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  data: {
    meta: PaymentMeta;
    result: PaymentResultItem[];
  };
}

export interface SinglePaymentResponse {
  success: boolean;
  message?: string;
  data: PaymentResultItem;
}

export interface PaymentQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayment: builder.query<PaymentResponse, PaymentQuery | void>({
      query: (params) => ({
        url: "/payment",
        method: "GET",
        params: params ?? { page: 1, limit: 10 },
      }),
      providesTags: (result) =>
        result
          ? [
              "Payments",
              ...result.data.result.map(({ _id }) => ({
                type: "Payments" as const,
                id: _id,
              })),
            ]
          : ["Payments"],
    }),
    getPaymentById: builder.query<SinglePaymentResponse, string>({
      query: (id) => ({
        url: `/payment/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Payments", id }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetPaymentQuery, useGetPaymentByIdQuery } = paymentApi;
