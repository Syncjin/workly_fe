import type { ApiResponse, AuthForgotIdRequest, AuthForgotPasswordRequest, AuthResetPasswordRequest, AuthRevokeRequest, UserLoginRequest, UserLoginResponse } from "@workly/types";
import type { HttpClient } from "./http";

export function createAuthApi(http: HttpClient) {
  return {
    postLogin: async (data: UserLoginRequest): Promise<ApiResponse<UserLoginResponse>> => {
      return http.post<UserLoginResponse>("/auth/login", data);
    },
    postRevoke: async (data: AuthRevokeRequest): Promise<ApiResponse<any>> => {
      return http.post<UserLoginResponse>("/auth/revoke", data);
    },
    postResetPassword: async (data: AuthResetPasswordRequest): Promise<ApiResponse<any>> => {
      return http.post<any>("/auth/reset-password", data);
    },
    postForgotPassword: async (data: AuthForgotPasswordRequest): Promise<ApiResponse<any>> => {
      return http.post<any>("/auth/forgot-password", data);
    },
    postForgotId: async (data: AuthForgotIdRequest): Promise<ApiResponse<any>> => {
      return http.post<any>("/auth/forgot-id", data);
    },
  };
}
