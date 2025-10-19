/**
 * Auth entity types
 *
 * Auth 인증 관련
 */

import type { UserLoginRequest as UserLoginRequestDTO, UserLoginResponse as UserLoginResponseDTO } from "@workly/types";

export interface UserLoginRequest extends UserLoginRequestDTO {}

export interface UserLoginResponse extends UserLoginResponseDTO {
  csrfToken?: string;
}
