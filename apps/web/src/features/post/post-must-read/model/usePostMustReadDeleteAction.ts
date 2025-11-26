/**
 * 게시글 필독 해제 기능 훅
 */

import { isPostDetailKey, isPostListKey, usePostMustReadDelete } from "@/entities/post";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function usePostMustReadDeleteAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending, error } = usePostMustReadDelete();

  const run = useCallback(
    async (postId: number) => {
      if (!Number.isFinite(postId) || postId <= 0) {
        return;
      }

      try {
        return await mutateAsync({ postId });
      } finally {
        // 게시글 상세 및 목록 캐시 무효화
        qc.invalidateQueries({ predicate: ({ queryKey }) => isPostDetailKey(queryKey) });
        qc.invalidateQueries({ predicate: ({ queryKey }) => isPostListKey(queryKey) });
      }
    },
    [qc, mutateAsync]
  );

  return { run, isPending, error };
}
