import type { ApiResponse, AuthForgotIdRequest, AuthForgotIdResponse, AuthForgotPasswordRequest, AuthForgotPasswordResponse, AuthResetPasswordRequest, AuthResetPasswordResponse, AuthRevokeRequest, UserLoginRequest, UserLoginResponse } from "@workly/types";
import type { HttpClient } from "./http";

export function createAuthApi(http: HttpClient) {
  return {
    postLogin: async (data: UserLoginRequest): Promise<ApiResponse<UserLoginResponse>> => {
      return http.post<UserLoginResponse>("/auth/login", data);
    },
    postRevoke: async (data: AuthRevokeRequest): Promise<ApiResponse<void>> => {
      return http.post<void>("/auth/revoke", data);
    },
    postResetPassword: async (data: AuthResetPasswordRequest): Promise<ApiResponse<AuthResetPasswordResponse>> => {
      return http.post<AuthResetPasswordResponse>("/auth/reset-password", data);
    },
    postForgotPassword: async (data: AuthForgotPasswordRequest): Promise<ApiResponse<AuthForgotPasswordResponse>> => {
      return http.post<AuthForgotPasswordResponse>("/auth/forgot-password", data);
    },
    postForgotId: async (data: AuthForgotIdRequest): Promise<ApiResponse<AuthForgotIdResponse>> => {
      return http.post<AuthForgotIdResponse>("/auth/forgot-id", data);
    },
  };
}
