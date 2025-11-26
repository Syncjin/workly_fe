/**
 * Auth React Query 훅
 *
 */

import { authApi } from "@/entities/auth/api/authApi";
import type { AuthForgotIdRequest, AuthForgotIdResponse, AuthForgotPasswordRequest, AuthForgotPasswordResponse, AuthResetPasswordRequest, AuthResetPasswordResponse, UserLoginRequest, UserLoginResponse } from "@/entities/auth/model";
import { useApiMutation } from "@/shared/api/hooks";

/**
 * 로그인 React Query 훅
 */
export const useLogin = () => {
  return useApiMutation<UserLoginResponse, UserLoginRequest>((params) => authApi.postLogin(params), {});
};

/**
 * 아이디 찾기 React Query 훅
 */
export const useForgotId = () => {
  return useApiMutation<AuthForgotIdResponse, AuthForgotIdRequest>((params) => authApi.postForgotId(params), {});
};

/**
 * 비밀번호 찾기 React Query 훅
 */
export const useForgotPassword = () => {
  return useApiMutation<AuthForgotPasswordResponse, AuthForgotPasswordRequest>((params) => authApi.postForgotPassword(params), {});
};

/**
 * 비밀번호 재설정 React Query 훅
 */
export const useResetPassword = () => {
  return useApiMutation<AuthResetPasswordResponse, AuthResetPasswordRequest>((params) => authApi.postResetPassword(params), {});
};
