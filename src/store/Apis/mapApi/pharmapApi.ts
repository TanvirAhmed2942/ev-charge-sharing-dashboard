import { baseApi } from "../baseApi";

// API response types
export interface PharmacyLocation {
  type: string; // "Point"
  coordinates: [number, number]; // [longitude, latitude]
}

export interface PharmacyItem {
  _id: string;
  logo: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  title: string;
  yearofBusiness: string;
  message: string;
  status: string;
  latitude: number;
  longitude: number;
  location: PharmacyLocation;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetPharmaciesResponse {
  success: boolean;
  message: string;
  data: PharmacyItem[];
}

export interface GetPharmaciesParams {
  postCode: string;
  city: string;
  state: string;
}

export interface CoverageZipcodeItem {
  _id: string;
  zipCode: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetCoverageZipcodeResponse {
  success: boolean;
  message: string;
  data: CoverageZipcodeItem[];
  meta?: { page: number; limit: number; total: number; totalPage: number };
}

export const mapApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPharmacies: builder.query<GetPharmaciesResponse, GetPharmaciesParams>({
      query: ({ postCode }) => ({
        url: `/pharmacies/all-pharmacie-by-map?postCode=${postCode}`,
        method: "GET",
      }),
      providesTags: ["Map"],
    }),
    getPartnerPharmaciesLogo: builder.query({
      query: () => ({
        url: `/pharmacies/logo`, //limit 100
        method: "GET",
      }),
      providesTags: ["Map"],
    }),
    getCoverageZipcode: builder.query<
      GetCoverageZipcodeResponse,
      { limit?: number } | void
    >({
      query: (params) => {
        const search =
          params && params.limit != null ? `?limit=${params.limit}` : "";
        return {
          url: `/coverage-zip-code${search}`,
          method: "GET",
        };
      },
      providesTags: ["Map"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPharmaciesQuery,
  useLazyGetPharmaciesQuery,
  useGetPartnerPharmaciesLogoQuery,
  useGetCoverageZipcodeQuery,
} = mapApi;
// &city=${city}&state=${state}
