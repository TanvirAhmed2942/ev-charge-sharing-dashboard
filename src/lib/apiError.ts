/**
 * Shape of error responses from the API (e.g. auth, users).
 */
export interface ApiErrorBody {
  success?: false;
  message?: string;
  errorSources?: Array<{ path?: string; message?: string }>;
  err?: { statusCode?: number };
  stack?: string;
}

/**
 * RTK Query error object (serialized or with data).
 */
export interface RtkQueryError {
  status?: number;
  data?: ApiErrorBody | unknown;
  error?: string;
}

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

/**
 * Get a user-friendly error message from an RTK Query error.
 * Handles API response shape: { message, errorSources: [{ message }] }.
 */
export function getApiErrorMessage(error: RtkQueryError | undefined | null): string {
  if (!error) return DEFAULT_MESSAGE;

  const data = error.data as ApiErrorBody | undefined;
  if (!data) return error.error || DEFAULT_MESSAGE;

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message.trim();
  }
  if (Array.isArray(data.errorSources) && data.errorSources.length > 0) {
    const first = data.errorSources[0];
    if (typeof first?.message === "string" && first.message.trim()) {
      return first.message.trim();
    }
  }
  return error.error || DEFAULT_MESSAGE;
}
