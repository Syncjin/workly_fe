/**
 * 인증 API
 */

import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api/types";
import type { UserLoginRequest, UserLoginResponse } from "../model/types";

/**
 * Auth API functions
 */
export const authApi = {
  postLogin: async (data: UserLoginRequest): Promise<ApiResponse<UserLoginResponse>> => {
    return await api.post<UserLoginResponse>("/auth/login", data);
  },
};
