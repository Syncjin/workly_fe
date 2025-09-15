/**
 * Users API functions
 * 사용자 정보 CRUD API
 */

import type { User } from "@/entities/users/model/types";
import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api/types";

/**
 * Users API functions
 */
export const usersApi = {
  getMyInfo: async (): Promise<ApiResponse<User>> => {
    return await api.get<User>("/users/myInfo");
  },
};
