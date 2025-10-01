import type { ApiResponse } from "@workly/types/common";
import type { UserLoginRequest, UserLoginResponse } from "@workly/types/domain";
import type { HttpClient } from "./http";

export function createAuthApi(http: HttpClient) {
  return {
    postLogin: async (data: UserLoginRequest): Promise<ApiResponse<UserLoginResponse>> => {
      return http.post<UserLoginResponse>("/auth/login", data);
    },
  };
}
