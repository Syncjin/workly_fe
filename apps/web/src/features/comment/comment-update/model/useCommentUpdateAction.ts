import { type Comment, commentQueryKeys, type CommentUpdateRequest, type PageData, useCommentUpdate } from "@/entities/comment";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@workly/types";
import { useCallback } from "react";

export function useCommentUpdateAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = useCommentUpdate();

  const run = useCallback(
    async ({ content, postId, commentId }: CommentUpdateRequest) => {
      // 관련 쿼리들을 취소하여 경쟁 상태 방지
      const cancelData = await qc.cancelQueries({ queryKey: commentQueryKeys.infiniteLists() });
      const qk = commentQueryKeys.infinite({ postId });
      const prev = qc.getQueryData<InfiniteData<ApiResponse<PageData>>>(qk);
      const nowISO = new Date().toISOString();

      const optimisticApplied = qc.setQueryData<InfiniteData<ApiResponse<PageData>>>(qk, (old) => {
        if (!old) return old;

        let found = false;
        const pages = old.pages.map((page) => {
          const items = page.data.items ?? [];
          const nextItems = items.map((it) => {
            if (it.commentId !== commentId) return it;
            found = true;
            const updated: Comment = {
              ...it,
              content,
              updatedDateTime: nowISO,
            };
            return updated;
          });

          // 못 찾았으면 원본 그대로 반환
          if (!found) return page;

          return {
            ...page,
            data: { ...page.data, items: nextItems },
          };
        });

        // 모든 페이지를 돌았는데 못 찾았으면 그대로 반환
        if (!found) return old;

        return { ...old, pages };
      });

      try {
        const result = await mutateAsync({ content, postId, commentId });

        qc.setQueryData<InfiniteData<ApiResponse<PageData>>>(qk, (old) => {
          if (!old) return old;

          let found = false;
          const pages = old.pages.map((page) => {
            const items = page.data.items ?? [];
            const nextItems = items.map((it) => {
              if (it.commentId !== commentId) return it;
              found = true;
              return result.data; // 서버가 내려준 최종 Comment로 교체
            });

            return found ? { ...page, data: { ...page.data, items: nextItems } } : page;
          });

          return found ? { ...old, pages } : old;
        });
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
