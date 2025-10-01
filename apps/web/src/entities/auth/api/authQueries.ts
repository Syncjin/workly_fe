/**
 * 게시글 React Query 훅
 *
 * 게시글 관련 데이터 페칭 작업을 위한 React Query 훅을 제공합니다.
 * 적절한 캐싱 전략과 함께 공유 useApiQuery 훅을 사용합니다.
 */

import { authApi } from "@/entities/auth/api/authApi";
import type { UserLoginRequest, UserLoginResponse } from "@/entities/auth/model";
import { useApiMutation } from "@/shared/api/hooks";

/**
 * 로그인 React Query 훅
 *
 */

export const useLogin = () => {
  return useApiMutation<UserLoginResponse, UserLoginRequest>((params) => authApi.postLogin(params), {});
};
