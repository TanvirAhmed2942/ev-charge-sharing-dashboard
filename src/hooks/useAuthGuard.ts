"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  isAuthorized as checkIsAuthorized,
  isAuthenticated as checkIsAuthenticated,
  getUserRole,
} from "@/utils/authUtils";

export interface UseAuthGuardOptions {
  allowedRoles?: string[];
  requireAuth?: boolean;
  redirectTo?: string;
  redirectOnMount?: boolean;
}

/**
 * Custom hook for authentication and role-based access control
 *
 * @param options - Configuration options
 * @returns { isAuthorized, isChecking, userRole, isAuthenticated }
 */
function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const {
    allowedRoles = [],
    requireAuth = true,
    redirectTo = "/auth/login",
    redirectOnMount = true,
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [userRole, setUserRoleState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check authentication status
        const authenticated = checkIsAuthenticated();
        setIsAuthenticated(authenticated);

        // Get user role
        const role = getUserRole();
        setUserRoleState(role);

        // Debug logging
        console.log("Auth Guard Check:", {
          authenticated,
          role,
          allowedRoles,
          requireAuth,
        });

        // Check authorization
        const authorized = checkIsAuthorized({
          allowedRoles,
          requireAuth,
        });

        console.log("Authorization result:", authorized);
        setIsAuthorized(authorized);

        // Redirect if not authorized and redirectOnMount is true
        if (!authorized && redirectOnMount) {
          const loginUrl = new URL(redirectTo, window.location.origin);
          if (!authenticated) {
            loginUrl.searchParams.set("redirect", pathname);
          } else {
            loginUrl.searchParams.set("error", "unauthorized");
            loginUrl.searchParams.set("redirect", pathname);
          }
          router.push(loginUrl.toString());
        }
      } catch (error) {
        console.error("Auth guard error:", error);
        setIsAuthorized(false);
        setIsAuthenticated(false);

        if (redirectOnMount) {
          router.push(redirectTo);
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [
    router,
    pathname,
    requireAuth,
    allowedRoles,
    redirectTo,
    redirectOnMount,
  ]);

  return {
    isAuthorized,
    isChecking,
    userRole,
    isAuthenticated,
  };
}

export default useAuthGuard;
