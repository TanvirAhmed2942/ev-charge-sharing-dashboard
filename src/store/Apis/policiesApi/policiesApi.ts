import { baseApi } from "@/store/Apis/baseApi";

export interface PoliciesData {
  _id: string;
  privacyPolicy: string;
  aboutUs: string;
  support: string;
  termsOfService: string;
  hipaaPolicy?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PoliciesResponse {
  success: boolean;
  message: string;
  data: PoliciesData;
}

export const policiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPolicies: builder.query<PoliciesResponse, void>({
      query: () => {
        return {
          url: "/setting",
          method: "GET",
        };
      },
      providesTags: ["Policies"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetPoliciesQuery } = policiesApi;
