import { commentQueryKeys, CommentReactionUpsertRequest, Reaction, useCommentReactionUpsert, type Comment, type PageData } from "@/entities/comment";
import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@workly/types";
import { useCallback } from "react";

export function useCommentReactionUpsertAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = useCommentReactionUpsert();

  const run = useCallback(
    async ({ commentId, commentReaction }: CommentReactionUpsertRequest) => {
      const cancelData = await qc.cancelQueries({ queryKey: commentQueryKeys.infiniteLists() });
      const reactionQk = commentQueryKeys.reaction(commentId);
      await qc.cancelQueries({ queryKey: reactionQk });

      const previousInfiniteData = qc.getQueryData<InfiniteData<ApiResponse<PageData>>>(commentQueryKeys.infiniteLists());
      const previousReactionData = qc.getQueryData<ApiResponse<Reaction>>(reactionQk);

      qc.setQueriesData<InfiniteData<ApiResponse<PageData>>>({ queryKey: commentQueryKeys.infiniteLists() }, (old) => {
        if (!old) return old;

        let found = false;
        const pages = old.pages.map((page) => {
          const items = page.data.items ?? [];
          const nextItems = items.map((comment) => {
            if (comment.commentId !== commentId) return comment;
            found = true;

            const updated: Comment = {
              ...comment,
              myReaction: commentReaction,
            };
            return updated;
          });

          return found ? { ...page, data: { ...page.data, items: nextItems } } : page;
        });

        return found ? { ...old, pages } : old;
      });

      try {
        const result = await mutateAsync({ commentId, commentReaction });

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
        if (previousReactionData) {
          qc.setQueryData(reactionQk, previousReactionData);
        }
        throw error;
      }
    },
    [qc, mutateAsync]
  );

  return { run, isPending };
}
