import type { PostListParams } from "@/entities/post";
import { postApi, postQueryKeys } from "@/entities/post";
import { log } from "@/lib/logger";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { SearchParamsUpdate } from "./types";

export const useSearchParamsManager = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const updateSearchParams = useCallback(
    async (updates: SearchParamsUpdate) => {
      const next = new URLSearchParams(searchParams || "");

      // keyword 처리
      if (updates.keyword !== undefined) {
        if (updates.keyword.trim()) {
          next.set("keyword", updates.keyword);
        } else {
          next.delete("keyword");
        }
      }

      // page 처리
      if (updates.page !== undefined) {
        if (updates.page > 0) {
          next.set("page", updates.page.toString());
        } else {
          next.delete("page");
        }
      }

      // size 처리
      if (updates.size !== undefined && updates.size !== 10) {
        next.set("size", updates.size.toString());
      }

      // 데이터 prefetch (선택적)
      const currentParams: PostListParams = {
        boardId: searchParams?.get("boardId") ? Number(searchParams.get("boardId")) : undefined,
        categoryId: searchParams?.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
        keyword: updates.keyword,
        page: updates.page || 1,
        size: updates.size || 10,
      };

      // boardId와 categoryId가 있을 때만 prefetch 실행
      if (currentParams.boardId && currentParams.categoryId) {
        try {
          const queryKey = postQueryKeys.list(currentParams);
          await queryClient.prefetchQuery({
            queryKey,
            queryFn: () => postApi.getPosts(currentParams),
            staleTime: 10_000,
          });
        } catch (error) {
          // Prefetch 실패는 무시하고 계속 진행
          log.warn("Failed to prefetch posts:", error);
        }
      }

      // URL 업데이트
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname, queryClient]
  );

  return { updateSearchParams };
};
