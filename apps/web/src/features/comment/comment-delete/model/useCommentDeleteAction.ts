import { commentQueryKeys, type PageData, useCommentDelete } from "@/entities/comment";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { ApiResponse, CommentDeleteRequest } from "@workly/types";
import { useCallback } from "react";

export function useCommentDeleteAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = useCommentDelete();

  const run = useCallback(
    async ({ postId, commentId }: CommentDeleteRequest) => {
      await qc.cancelQueries({ queryKey: commentQueryKeys.infiniteLists() });
      const qk = commentQueryKeys.infinite({ postId });
      const prev = qc.getQueryData<InfiniteData<ApiResponse<PageData>>>(qk);

      qc.setQueryData<InfiniteData<ApiResponse<PageData>>>(qk, (old) => {
        if (!old) return old;

        let deleted = false;

        const anyPage = old.pages[0]?.data;
        const prevTotalItems = typeof anyPage?.totalItems === "number" ? anyPage.totalItems : undefined;
        const pageSize = typeof anyPage?.size === "number" ? anyPage.size : undefined;

        const pages = old.pages.map((page) => {
          const items = page.data.items ?? [];
          const nextItems = items.filter((it) => {
            const keep = it.commentId !== commentId;
            if (!keep) deleted = true;
            return keep;
          });

          // 해당 페이지가 아니면 원본 그대로
          if (items.length === nextItems.length) return page;

          // 해당 페이지면 items만 교체
          const nextData: PageData = {
            ...page.data,
            items: nextItems,
          };

          return { ...page, data: nextData };
        });

        if (!deleted) return old;

        const nextTotalItems = prevTotalItems !== undefined ? Math.max(0, prevTotalItems - 1) : prevTotalItems;
        const nextTotalPages = pageSize && nextTotalItems !== undefined ? Math.max(1, Math.ceil(nextTotalItems / pageSize)) : undefined;

        const pagesWithCounts = pages.map((page) => {
          if (nextTotalItems === undefined) return page;
          return {
            ...page,
            data: {
              ...page.data,
              totalItems: nextTotalItems,
              ...(nextTotalPages !== undefined ? { totalPages: nextTotalPages } : {}),
            },
          };
        });

        return { ...old, pages: pagesWithCounts };
      });

      try {
        const result = await mutateAsync({ postId, commentId });

        // 성공 후 재동기화 (해당 목록 및 관련 infinite 리스트)
        // qc.invalidateQueries({ queryKey: qk });
        qc.invalidateQueries({ queryKey: commentQueryKeys.infiniteLists() });

        return result;
      } catch (error) {
        // 롤백
        if (prev) {
          qc.setQueryData(qk, prev);
        }
        throw error;
      }
    },
    [qc, mutateAsync]
  );

  return { run, isPending };
}
