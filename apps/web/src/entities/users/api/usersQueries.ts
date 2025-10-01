import { usersApi } from "@/entities/users/api/usersApi";
import { useApiQuery, useApiSuspenseQuery } from "@/shared/api/hooks";
import type { UseQueryOptions, UseSuspenseQueryOptions } from "@tanstack/react-query";
import type { ApiError, ApiResponse } from "@workly/types/common";
import { type User, usersQueryKeys } from "../model";

/**
 * 사용자 정보를 가져오는 React Query 훅
 */

export const useMyInfo = <TSelected = ApiResponse<User>>(options?: Omit<UseQueryOptions<ApiResponse<User>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = usersQueryKeys.myInfo();
  return useApiQuery<User, TSelected>(queryKey, () => usersApi.getMyInfo(), {
    ...options,
  });
};

export const useMyInfoSuspense = <TSelected = ApiResponse<User>>(options?: Omit<UseSuspenseQueryOptions<ApiResponse<User>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = usersQueryKeys.myInfo();
  return useApiSuspenseQuery<User, TSelected>(queryKey, () => usersApi.getMyInfo(), {
    ...options,
  });
};
