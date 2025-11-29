/**
 * Auth entity types
 *
 * Auth 인증 관련
 */

import type { UserLoginRequest as UserLoginRequestDTO, UserLoginResponse as UserLoginResponseDTO } from "@workly/types";

export type { AuthForgotIdRequest, AuthForgotIdResponse, AuthForgotPasswordRequest, AuthForgotPasswordResponse, AuthResetPasswordRequest, AuthResetPasswordResponse, AuthRevokeRequest } from "@workly/types";

export type UserLoginRequest = UserLoginRequestDTO & {
  autoLogin?: boolean;
};

export type UserLoginResponse = UserLoginResponseDTO & {
  csrfToken?: string;
};
