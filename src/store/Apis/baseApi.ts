import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

export const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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

/**
 * Base query that normalizes API error responses.
 * Use getApiErrorMessage(error) from @/lib/apiError to show user-facing messages.
 */
const baseQueryWithErrorShape: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const err = result.error;
  if (err && Number(err.status) >= 400 && err.data) {
    const data = err.data as Record<string, unknown>;
    if (
      typeof data?.message === "string" ||
      Array.isArray(data?.errorSources)
    ) {
      err.data = {
        message: typeof data.message === "string" ? data.message : undefined,
        errorSources: Array.isArray(data.errorSources)
          ? data.errorSources
          : undefined,
        err: data.err,
      };
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorShape,
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
