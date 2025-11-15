/**
 * Auth React Query 훅
 *
 */

import { authApi } from "@/entities/auth/api/authApi";
import type { AuthForgotIdRequest, AuthForgotPasswordRequest, AuthResetPasswordRequest, UserLoginRequest, UserLoginResponse } from "@/entities/auth/model";
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
  return useApiMutation<any, AuthForgotIdRequest>((params) => authApi.postForgotId(params), {});
};

/**
 * 비밀번호 찾기 React Query 훅
 */
export const useForgotPassword = () => {
  return useApiMutation<any, AuthForgotPasswordRequest>((params) => authApi.postForgotPassword(params), {});
};

/**
 * 비밀번호 재설정 React Query 훅
 */
export const useResetPassword = () => {
  return useApiMutation<any, AuthResetPasswordRequest>((params) => authApi.postResetPassword(params), {});
};
