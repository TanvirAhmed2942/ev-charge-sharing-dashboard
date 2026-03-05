"use client";
import React, { useLayoutEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { login } from "./slices/userSlice/userSlice";
import Cookies from "js-cookie";

// Function to restore auth state synchronously (client-side only)
function restoreAuthState() {
  try {
    const token = Cookies.get("token");

    if (!token) {
      return;
    }

    // Try to restore from localStorage first (most reliable)
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        // Verify token hasn't expired (if it's a JWT)
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.exp && payload.exp * 1000 < Date.now()) {
              // Token expired, clear everything
              localStorage.removeItem("userData");
              return;
            }
          }
        } catch {
          // Not a JWT, continue
        }
        // Dispatch login action to restore state
        store.dispatch(login(userData));
        return;
      } catch {
        localStorage.removeItem("userData");
      }
    }

    // Fallback: Try to decode token
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          return;
        }
        store.dispatch(
          login({
            _id: payload.userId || payload._id || "",
            name: payload.name || payload.fullName || "",
            email: payload.email || "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            role: payload.role || "user",
            dateOfBirth: "",
            isLoggedIn: true,
          })
        );
      }
    } catch {
      // Token decode failed
    }
  } catch (error) {
    // Error accessing cookies/localStorage
    console.warn("Failed to restore auth state:", error);
  }
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use useLayoutEffect to run synchronously before paint
  // This ensures auth state is restored before components render
  useLayoutEffect(() => {
    restoreAuthState();
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
