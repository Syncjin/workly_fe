import type { ApiResponse, UserLoginRequest, UserLoginResponse } from "@workly/types";
import type { HttpClient } from "./http";

export function createAuthApi(http: HttpClient) {
  return {
    postLogin: async (data: UserLoginRequest): Promise<ApiResponse<UserLoginResponse>> => {
      return http.post<UserLoginResponse>("/auth/login", data);
    },
  };
}
