import { useApiQuery, useApiSuspenseQuery } from "@/shared/api/hooks";
import type { ApiError, ApiResponse } from "@/shared/api/types";
import type { UseQueryOptions, UseQueryResult, UseSuspenseQueryOptions } from "@tanstack/react-query";
import { User, usersQueryKeys } from "../model";

/**
 * 사용자 정보를 가져오는 React Query 훅
 */

export const useMyInfo = <TSelected = ApiResponse<User>>(options?: Omit<UseQueryOptions<ApiResponse<User>, ApiError, TSelected>, "queryKey" | "queryFn">): UseQueryResult<TSelected, ApiError> => {
  const queryKey = usersQueryKeys.myInfo();

  return useApiQuery<User, TSelected>(queryKey, "/users/myInfo", {
    ...options,
  });
};

export const useMyInfoSuspense = <TSelected = ApiResponse<User>>(options?: Omit<UseSuspenseQueryOptions<ApiResponse<User>, ApiError, TSelected>, "queryKey" | "queryFn">) => {
  const queryKey = usersQueryKeys.myInfo();
  return useApiSuspenseQuery<User, TSelected>(queryKey, "/users/myInfo", {
    ...options,
  });
};
