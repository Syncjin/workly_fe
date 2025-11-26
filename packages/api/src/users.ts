import type { ApiResponse, UserDTO } from "@workly/types";
import type { HttpClient } from "./http";

export function createUsersApi(http: HttpClient) {
  return {
    getMyInfo: async (): Promise<ApiResponse<UserDTO>> => {
      return http.get<UserDTO>("/users/myInfo");
    },
  };
}
