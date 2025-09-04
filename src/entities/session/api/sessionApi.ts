/**
 * 인증 API
 */

import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api/types";
import { UserLoginRequest, UserLoginResponse } from "../model/types";

/**
 * Sesseion API functions
 */
export const sessionApi = {
  postLogin: async (data: UserLoginRequest): Promise<ApiResponse<UserLoginResponse>> => {
    return await api.post<UserLoginResponse>("/auth/login", data);
  },
};
