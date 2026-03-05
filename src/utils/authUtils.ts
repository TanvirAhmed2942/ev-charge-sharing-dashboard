import Cookies from "js-cookie";

/**
 * Check if the user is authenticated (has a valid token).
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = Cookies.get("token");
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the current user's role from localStorage (userData) or JWT payload.
 */
export function getUserRole(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("userData");
    if (stored) {
      const data = JSON.parse(stored);
      if (data?.role) return String(data.role);
    }
    const token = Cookies.get("token");
    if (token) {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload?.role) return String(payload.role);
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export interface IsAuthorizedOptions {
  allowedRoles: string[];
  requireAuth: boolean;
}

/**
 * Check if the user is authorized (authenticated and role in allowedRoles when specified).
 */
export function isAuthorized(options: IsAuthorizedOptions): boolean {
  const { allowedRoles = [], requireAuth = true } = options;
  const authenticated = isAuthenticated();
  if (requireAuth && !authenticated) return false;
  if (!requireAuth) return true;
  if (allowedRoles.length === 0) return authenticated;
  const role = getUserRole();
  if (!role) return false;
  return allowedRoles.some((r) => r.toLowerCase() === role.toLowerCase());
}
