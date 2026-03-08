import { baseApi } from "../baseApi";

/** API status values for parking place filter */
export type ParkingPlaceStatus = "pending" | "approved" | "rejected";

export interface ParkingPlaceItem {
  _id: string;
  userId: Owner;
  name: string;
  locationAddress: string;
  price: number;
  chargerType: string;
  isActive: boolean;
  images: string[];
  status: string;
  latitude: number;
  longitude: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  location?: {
    type: string;
    coordinates: number[];
  };
}

export interface Owner {
  _id: string;
  profile: string;
  fullName: string;
  email: string;
  role: string;
}
export interface ParkingPlacesMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ParkingPlacesResponse {
  success: boolean;
  message?: string;
  meta: ParkingPlacesMeta;
  data: ParkingPlaceItem[];
}

export interface GetParkingSpacesParams {
  status?: ParkingPlaceStatus;
  page?: number;
  limit?: number;
}

export interface UpdateParkingSpaceRequest {
  _id: string;
  status: "approved" | "rejected";
}

export const parkingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getParkingSpaces: builder.query<
      ParkingPlacesResponse,
      GetParkingSpacesParams | void
    >({
      query: (params) => {
        const status = params?.status;
        return {
          url: "/parking-place/admin",
          method: "GET",
          params: {
            ...(status && { status }),
            ...(params?.page != null && { page: params.page }),
            ...(params?.limit != null && { limit: params.limit }),
          },
        };
      },
      providesTags: (result) =>
        result
          ? [
              "ParkingSpaces",
              ...result.data.map(({ _id }) => ({
                type: "ParkingSpaces" as const,
                id: _id,
              })),
            ]
          : ["ParkingSpaces"],
    }),
    updateParkingSpace: builder.mutation<
      { success?: boolean; message?: string },
      UpdateParkingSpaceRequest
    >({
      query: ({ _id, status }) => ({
        url: `/parking-place/approved/rejected/${_id}`,
        method: "PATCH",
        params: { status },
      }),
      invalidatesTags: ["ParkingSpaces"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetParkingSpacesQuery, useUpdateParkingSpaceMutation } =
  parkingApi;
