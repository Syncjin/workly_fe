/**
 * Auth entity types
 *
 * Auth 인증 관련
 */

import type { UserLoginRequest as UserLoginRequestDTO, UserLoginResponse as UserLoginResponseDTO } from "@workly/types";

export type { AuthForgotIdRequest, AuthForgotPasswordRequest, AuthResetPasswordRequest, AuthRevokeRequest } from "@workly/types";

export type UserLoginRequest = UserLoginRequestDTO & {
  autoLogin?: boolean;
};

export type UserLoginResponse = UserLoginResponseDTO & {
  csrfToken?: string;
};
