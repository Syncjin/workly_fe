import type { ApiResponse } from "@workly/types/common";
import type { UserDTO } from "@workly/types/domain";
import type { HttpClient } from "./http";

export function createUsersApi(http: HttpClient) {
  return {
    getMyInfo: async (): Promise<ApiResponse<UserDTO>> => {
      return http.get<UserDTO>("/users/myInfo");
    },
  };
}
