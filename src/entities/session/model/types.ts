/**
 * Session entity types
 *
 * Auth 인증 관련
 */

export interface UserLoginRequest {
  userId: string;
  password: string;
}

export interface UserLoginResponse {
  accessToken: string;
  csrfToken?: string;
  tokenType: string;
  expiresIn: number;
}
