export interface UserLoginRequest {
  userId: string;
  password: string;
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
