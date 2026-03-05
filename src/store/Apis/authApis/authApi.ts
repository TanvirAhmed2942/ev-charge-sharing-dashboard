import Cookies from "js-cookie";
import { baseApi } from "../baseApi";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      _id: string;
      profile?: string;
      fullName: string;
      email: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
}

interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  agreement: boolean;
}

interface SignupResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: {
      _id: string;
      profile?: string;
      fullName: string;
      email: string;
      role: string;
    };
    accessToken?: string;
    refreshToken?: string;
    createUserToken?: string;
  };
  error?: string;
}

interface VerifyEmailRequest {
  otp: string;
}

interface VerifyEmailResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: string;
}

interface ResendCreateUserOtpResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    forgetToken: string;
  };
}

interface ForgotPasswordOtpMatchRequest {
  otp: string;
}

interface ForgotPasswordOtpMatchResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    forgetOtpMatchToken: string;
  };
}

interface ResendForgotPasswordOtpResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: string;
}

interface ResetPasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: string;
}

interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword: string;
  otp?: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body: LoginRequest) => ({
        url: "/auth/login",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Auth"],
    }),
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (body: SignupRequest) => ({
        url: "/users/create",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Auth"],
    }),
    // User API
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: ({ otp }) => {
        const token = Cookies.get("forgetToken");

        return {
          url: `/users/verify-otp`,
          method: "POST",
          body: { otp },
          headers: {
            token: token || "",
          },
        };
      },
      invalidatesTags: ["Auth"],
    }),

    resendCreateUserOtp: builder.mutation<ResendCreateUserOtpResponse, void>({
      query: () => {
        const token = Cookies.get("forgetToken");

        return {
          url: "/auth/resend-otp",
          method: "POST",
          headers: {
            token: token || "",
          },
        };
      },
      invalidatesTags: ["Auth"],
    }),

    // Forgot Password API

    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (body: ForgotPasswordRequest) => ({
        url: `/auth/forgot-password-otp`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Auth"],
    }),
    forgotPasswordOtpMatch: builder.mutation<
      ForgotPasswordOtpMatchResponse,
      ForgotPasswordOtpMatchRequest
    >({
      query: ({ otp }) => {
        const forgetToken = Cookies.get("forgetToken");

        return {
          url: "/auth/forgot-password-otp-match",
          method: "PATCH",
          body: { otp },
          headers: {
            token: forgetToken || "",
          },
        };
      },
      invalidatesTags: ["Auth"],
    }),
    resendForgotPasswordOtp: builder.mutation<
      ResendForgotPasswordOtpResponse,
      void
    >({
      query: () => {
        const forgetToken = Cookies.get("forgetToken");

        return {
          url: "/otp/resend-otp",
          method: "PATCH",
          headers: {
            token: forgetToken || "",
          },
        };
      },
      invalidatesTags: ["Auth"],
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (body: ResetPasswordRequest) => {
        const token = Cookies.get("forgetToken");

        return {
          url: "/auth/forgot-password-reset",
          method: "PATCH",
          body: body,
          headers: {
            token: token || "",
          },
        };
      },
      invalidatesTags: ["Auth"],
    }),
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body: ChangePasswordRequest) => {
        const token = Cookies.get("token");
        return {
          url: "/auth/change-password",
          method: "POST",
          body: body,
          headers: {
            token: token || "",
          },
        };
      },
      invalidatesTags: ["Auth"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyEmailMutation,
  useResendCreateUserOtpMutation,
  useForgotPasswordMutation,
  useForgotPasswordOtpMatchMutation,
  useResendForgotPasswordOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
