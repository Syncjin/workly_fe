import type { BoardCategory } from "@/entities/boardCategory/model/types";
import { useApiQuery, useApiSuspenseQuery } from "@/shared/api/hooks";
import type { ApiError, ApiResponse } from "@/shared/api/types";
import type { UseQueryOptions, UseQueryResult, UseSuspenseQueryOptions } from "@tanstack/react-query";
import { boardCategoryQueryKeys } from "../model";

/**
 * 게시판 카테코리 목록을 가져오는 React Query 훅
 */

export const useBoardCategoryList = <TSelected = ApiResponse<BoardCategory[]>>(
    options?: Omit<
        UseQueryOptions<ApiResponse<BoardCategory[]>, ApiError, TSelected>,
        "queryKey" | "queryFn"
    >
): UseQueryResult<TSelected, ApiError> => {
    const queryKey = boardCategoryQueryKeys.list();

    return useApiQuery<BoardCategory[], TSelected>(queryKey, "/board-category", {
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        ...options,
    });
};

export const useBoardCategoryListSuspense = <
    TSelected = ApiResponse<BoardCategory[]>
>(
    options?: Omit<
        UseSuspenseQueryOptions<ApiResponse<BoardCategory[]>, ApiError, TSelected>,
        "queryKey" | "queryFn"
    >
) => {
    const queryKey = boardCategoryQueryKeys.list();
    return useApiSuspenseQuery<BoardCategory[], TSelected>(
        queryKey,
        "/board-category",
        {
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
            ...options,
        }
    );
};