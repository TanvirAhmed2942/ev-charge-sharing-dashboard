import { baseApi } from "@/store/Apis/baseApi";

export interface PaymentUserId {
  _id: string;
  profile?: string;
  email?: string;
  role?: string;
}

export interface PaymentPrescriptionOrder {
  _id: string;
  userId?: string;
  typeUser?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  email?: string;
  phone?: string;
  legalName?: string;
  dateOfBirth?: string;
  amount?: number;
  deliveryInstruction?: string;
  deliveryCharge?: number;
  serviceCharge?: number;
  status?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface PaymentItem {
  _id: string;
  userId?: PaymentUserId;
  method?: string;
  amount?: number;
  status?: string;
  transactionId?: string;
  prescriptionOrderId?: PaymentPrescriptionOrder;
  transactionDate?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface PaymentMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    meta: PaymentMeta;
    result: PaymentItem[];
  };
}

export interface SinglePaymentResponse {
  success: boolean;
  message: string;
  data: PaymentItem;
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
      query: (params) => {
        return {
          url: "/payment/user",
          method: "GET",
          params: params || { page: 1, limit: 10 },
        };
      },
      providesTags: ["Payment"],
    }),
    getPaymentById: builder.query<SinglePaymentResponse, string>({
      query: (id) => {
        return {
          url: `/payment/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Payment"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetPaymentQuery, useGetPaymentByIdQuery } = paymentApi;
