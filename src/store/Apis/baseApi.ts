import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { logout, setCredentials } from "@/store/slices/userSlice/userSlice";

export const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RefreshTokenResponse {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
  };
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { endpoint, type }) => {
    const token = getCookie("token");
    const verifyToken = getCookie("verifyToken");

    if (verifyToken) {
      headers.set("resettoken", verifyToken);
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // RTK Query automatically handles FormData and won't set Content-Type for it
    // Only set Content-Type for JSON requests (not for FormData)
    // Check if this is updateProfile mutation - it might use FormData
    const isUpdateProfile = endpoint === "updateProfile" && type === "mutation";

    // Set Content-Type only if not already set (FormData will have its own)
    // For updateProfile, we'll let RTK Query handle it automatically
    if (!isUpdateProfile && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  },
});

function normalizeErrorResponse(error: FetchBaseQueryError | undefined): void {
  if (!error || Number(error.status) < 400 || !error.data) return;

  const data = error.data as Record<string, unknown>;
  if (typeof data?.message === "string" || Array.isArray(data?.errorSources)) {
    error.data = {
      message: typeof data.message === "string" ? data.message : undefined,
      errorSources: Array.isArray(data.errorSources) ? data.errorSources : undefined,
      err: data.err,
    };
  }
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && Number(result.error.status) === 401) {
    const requestUrl = typeof args === "string" ? args : args.url;
    const isRefreshRequest = requestUrl.includes("/auth/refresh-token");

    if (!isRefreshRequest) {
      const refreshResult = await rawBaseQuery("/auth/refresh-token", api, extraOptions);
      if (refreshResult.data) {
        const refreshData = refreshResult.data as RefreshTokenResponse;
        const newAccessToken = refreshData?.data?.accessToken;

        if (newAccessToken) {
          api.dispatch(setCredentials({ accessToken: newAccessToken }));
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } else {
        api.dispatch(logout());
      }
    }
  }

  normalizeErrorResponse(result.error);
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Profile",
    "Policies",
    "Faq",
    "Commission",
    "Users",
    "ParkingSpaces",
    "Payments",
    "Bookings",
    "Dashboard",
    "Notifications",
  ],
  endpoints: () => ({}),
});
