import { baseApi } from "../baseApi";

export interface PoliciesData {
  _id: string;
  privacyPolicy: string;
  aboutUs: string;
  support: string;
  termsOfService: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PoliciesResponse {
  success: boolean;
  message?: string;
  data: PoliciesData;
}

/** PATCH accepts partial updates (e.g. only termsOfService or only aboutUs). */
export type UpdatePoliciesRequest = Partial<PoliciesData>;

export const policiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPolicies: builder.query<PoliciesResponse, void>({
      query: () => ({
        url: "/setting",
        method: "GET",
      }),
      providesTags: ["Policies"],
    }),
    updatePolicies: builder.mutation<PoliciesResponse, UpdatePoliciesRequest>({
      query: (body) => ({
        url: "/setting",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Policies"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetPoliciesQuery, useUpdatePoliciesMutation } = policiesApi;
