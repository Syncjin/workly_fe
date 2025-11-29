import { commentQueryKeys, CommentReactionDeleteRequest, useCommentReactionDelete, type PageData } from "@/entities/comment";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@workly/types";
import { useCallback } from "react";

export function useCommentReactionDeleteAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = useCommentReactionDelete();

  const run = useCallback(
    async ({ commentId }: CommentReactionDeleteRequest) => {
      await qc.cancelQueries({ queryKey: commentQueryKeys.infiniteLists() });

      const reactionQk = commentQueryKeys.reaction(commentId);
      await qc.cancelQueries({ queryKey: reactionQk });

      const previousInfiniteData = qc.getQueryData<InfiniteData<ApiResponse<PageData>>>(commentQueryKeys.infiniteLists());

      try {
        const result = await mutateAsync({ commentId });

        // 성공 시 모든 댓글 목록에서 해당 댓글의 반응 정보 업데이트
        qc.setQueriesData<InfiniteData<ApiResponse<PageData>>>({ queryKey: commentQueryKeys.infiniteLists() }, (old) => {
          if (!old) return old;

          let found = false;
          const pages = old.pages.map((page) => {
            const items = page.data.items ?? [];
            const nextItems = items.map((comment) => {
              if (comment.commentId !== commentId) return comment;
              found = true;
              return result.data;
            });

            return found ? { ...page, data: { ...page.data, items: nextItems } } : page;
          });

          return found ? { ...old, pages } : old;
        });

        qc.invalidateQueries({ queryKey: reactionQk });

        return result;
      } catch (error) {
        // 롤백
        if (previousInfiniteData) {
          qc.setQueriesData({ queryKey: commentQueryKeys.infiniteLists() }, previousInfiniteData);
        }
        throw error;
      }
    },
    [qc, mutateAsync]
  );

  return { run, isPending };
}
