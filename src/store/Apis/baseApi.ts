import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";
import { logout, setCredentials } from "@/store/slices/userSlice/userSlice";

const rawBase =
  typeof process.env.NEXT_PUBLIC_API_BASE_URL === "string"
    ? process.env.NEXT_PUBLIC_API_BASE_URL.trim()
    : "";

export const baseUrl = rawBase.replace(/\/$/, "") || undefined;

interface RefreshTokenResponse {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
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
  baseUrl: baseUrl ?? "",
  // Omit credentials: "include" for cross-origin API calls unless the server sends
  // Access-Control-Allow-Credentials: true (required with credentials mode).
  // Tokens are applied via Authorization from getCookie() instead.
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

/** 401 on these routes means invalid credentials / public flow — do not refresh session. */
function shouldAttemptRefreshForUrl(url: string): boolean {
  const skip: string[] = [
    "/auth/login",
    "/auth/refresh-token",
    "/users/create",
    "/auth/forgot-password-otp",
    "/auth/forgot-password-otp-match",
    "/auth/forgot-password-reset",
    "/users/verify-otp",
    "/auth/resend-otp",
    "/otp/resend-otp",
  ];
  return !skip.some((p) => url.includes(p));
}

function getErrorHttpStatus(error: FetchBaseQueryError | undefined): number {
  if (!error?.status) return 0;
  const n = Number(error.status);
  if (!Number.isNaN(n) && n > 0) return n;
  if (typeof error.status === "number") return error.status;
  return 0;
}

/**
 * Backend sometimes returns HTTP 200 with JSON like:
 * { success: false, err: { statusCode: 401 }, message: "Token has expired", ... }
 * fetchBaseQuery treats that as success, so we detect "unauthorized" here to trigger refresh.
 */
function isUnauthorizedApiBody(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (d.success !== false) return false;

  const err = d.err;
  if (err && typeof err === "object" && "statusCode" in err) {
    const code = Number((err as { statusCode?: unknown }).statusCode);
    if (code === 401) return true;
  }

  const msg = typeof d.message === "string" ? d.message.toLowerCase() : "";
  if (
    msg.includes("token has expired") ||
    msg.includes("token expired") ||
    msg.includes("jwt expired") ||
    msg.includes("access token expired")
  ) {
    return true;
  }

  const sources = d.errorSources;
  if (Array.isArray(sources)) {
    for (const s of sources) {
      if (!s || typeof s !== "object") continue;
      const m = String((s as { message?: string }).message ?? "").toLowerCase();
      if (
        m.includes("token has expired") ||
        m.includes("token expired") ||
        m.includes("jwt expired")
      ) {
        return true;
      }
    }
  }

  return false;
}

function needsSessionRefresh(
  result: { data?: unknown; error?: FetchBaseQueryError | undefined },
  requestUrl: string,
): boolean {
  if (!shouldAttemptRefreshForUrl(requestUrl)) return false;
  if (result.error && getErrorHttpStatus(result.error) === 401) return true;
  if (result.data && isUnauthorizedApiBody(result.data)) return true;
  return false;
}

function bodyToRtkError(
  data: unknown,
): { status: 401; data: unknown } {
  return { status: 401, data };
}

/**
 * POST /auth/refresh-token — no body.
 * Backend expects the refresh JWT in the `refreshToken` header (matches Postman).
 */
async function fetchNewAccessToken(): Promise<string | null> {
  if (!baseUrl || typeof fetch === "undefined") return null;

  const refreshToken = getCookie("refreshToken");
  if (!refreshToken) return null;

  const headers: HeadersInit = {
    Accept: "application/json",
    refreshToken,
  };

  try {
    const res = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: "POST",
      headers,
    });
    const text = await res.text();
    if (!res.ok || !text) return null;
    const json = JSON.parse(text) as RefreshTokenResponse;
    const access = json?.data?.accessToken ?? null;
    const nextRefresh = json?.data?.refreshToken;
    if (access && nextRefresh) {
      Cookies.set("refreshToken", nextRefresh);
    }
    return access;
  } catch {
    return null;
  }
}

let refreshAccessTokenPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (!refreshAccessTokenPromise) {
    refreshAccessTokenPromise = fetchNewAccessToken().finally(() => {
      // Defer clearing so callers awaiting the same promise can run setCredentials
      // before a new refresh starts (avoids a second refresh failing and logging out).
      setTimeout(() => {
        refreshAccessTokenPromise = null;
      }, 0);
    });
  }

  return refreshAccessTokenPromise;
}

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

  const requestUrl = typeof args === "string" ? args : args.url;

  if (needsSessionRefresh(result, requestUrl)) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      api.dispatch(setCredentials({ accessToken: newAccessToken }));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  if (
    result.data &&
    isUnauthorizedApiBody(result.data) &&
    shouldAttemptRefreshForUrl(requestUrl)
  ) {
    result = { error: bodyToRtkError(result.data) };
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
