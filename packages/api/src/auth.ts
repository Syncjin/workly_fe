import type { ApiResponse, AuthRevokeRequest, UserLoginRequest, UserLoginResponse } from "@workly/types";
import type { HttpClient } from "./http";

export function createAuthApi(http: HttpClient) {
  return {
    postLogin: async (data: UserLoginRequest): Promise<ApiResponse<UserLoginResponse>> => {
      return http.post<UserLoginResponse>("/auth/login", data);
    },
    postRevoke: async (data: AuthRevokeRequest): Promise<ApiResponse<any>> => {
      return http.post<UserLoginResponse>("/auth/revoke", data);
    },
  };
}
