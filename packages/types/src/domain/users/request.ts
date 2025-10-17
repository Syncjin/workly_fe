export interface UserLoginRequest {
  userId: string;
  password: string;
}

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

/**
 * 사용자 주소록. 사용자 프로필
 */
export interface DirectoryUserDTO {
  userId: string;
  name: string;
  teamName: string;
  positionName: string;
  profile: string;
  description: string;
}

export interface UsersListRequest {
  page?: number;
  size?: number;
  query?: string;
}
