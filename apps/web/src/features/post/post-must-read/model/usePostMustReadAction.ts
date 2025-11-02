/**
 * 게시글 필독 설정 기능 훅
 */

import { usePostMustRead } from "@/entities/post";
import { useCallback } from "react";

export function usePostMustReadAction() {
  const { mutateAsync, isPending, error } = usePostMustRead();

  const run = useCallback(
    async (postId: number) => {
      if (!Number.isFinite(postId) || postId <= 0) {
        return;
      }

      return await mutateAsync({ postId });
    },
    [mutateAsync]
  );

  return { run, isPending, error };
}
