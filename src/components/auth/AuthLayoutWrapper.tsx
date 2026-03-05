"use client";

import useAuthGuard from "@/hooks/useAuthGuard";
import { Loader } from "lucide-react";

export interface AuthLayoutWrapperProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
  redirectOnMount?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Client-side wrapper component for protecting layouts.
 * Use this to wrap layout content that needs auth checks.
 */
export default function AuthLayoutWrapper({
  children,
  allowedRoles = [],
  requireAuth = true,
  redirectOnMount = true,
  fallback = null,
}: AuthLayoutWrapperProps) {
  const { isAuthorized, isChecking } = useAuthGuard({
    allowedRoles,
    requireAuth,
    redirectOnMount,
  });

  // Show loading state
  if (isChecking) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="flex items-center justify-center gap-2 min-h-screen">
        <Loader className="size-4 animate-spin text-gray-900" />
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  // If not authorized and redirectOnMount is false, show unauthorized message
  if (!isAuthorized && !redirectOnMount) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // If not authorized and redirectOnMount is true, redirect is happening
  if (!isAuthorized) {
    return null;
  }

  // Authorized - render children
  return <>{children}</>;
}
