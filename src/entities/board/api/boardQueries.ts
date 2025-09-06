import type { Board } from "@/entities/board/model/types";
import { useApiQuery } from "@/shared/api/hooks";
import type { ApiError, ApiResponse } from "@/shared/api/types";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { boardQueryKeys } from "../model";

/**
 * 게시판 목록을 가져오는 React Query 훅
 */

export const useBoardList = <TSelected = ApiResponse<Board[]>>(
    options?: Omit<
        UseQueryOptions<ApiResponse<Board[]>, ApiError, TSelected>,
        "queryKey" | "queryFn"
    >
): UseQueryResult<TSelected, ApiError> => {
    const queryKey = boardQueryKeys.list();

    return useApiQuery<Board[], TSelected>(queryKey, "/boards", {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 3,
        retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        enabled: true,
        ...options,
    });
};