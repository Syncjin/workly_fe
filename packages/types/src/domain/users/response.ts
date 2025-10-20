export interface UserLoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export type UserMyInfoResponse = UserDTO;

export type UserRole = "ROLE_ADMIN" | "ROLE_USER";

export interface UserDTO {
  id: number;
  userId: string;
  name: string;
  birthDate: string;
  email: string;
  profile: string;
  description: string;
  positionId: number;
  positionName: string;
  teamId: number;
  teamName: string;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETED";
  role: UserRole;
  createdDateTime: string;
  updatedDateTime: string;
}
