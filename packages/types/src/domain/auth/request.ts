export interface AuthRevokeRequest {
  refreshToken: string;
}

export interface AuthResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthForgotPasswordRequest {
  userId: string;
  name: string;
  email: string;
}

export interface AuthForgotIdRequest {
  name: string;
  email: string;
}
