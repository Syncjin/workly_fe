import type { UserDTO } from "@workly/types/domain/users/request";

export interface UserLoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export type UserMyInfoResponse = UserDTO;