import { createOptimisticUpdater, isPostDetailKey, isPostListKey, patchAnyLike, usePostLike } from "@/entities/post";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function usePostLikeAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = usePostLike();

  const updater = createOptimisticUpdater(qc, patchAnyLike);

  const run = useCallback(
    async (postId: number) => {
      const result = await updater(postId, () => mutateAsync({ postId }));

      qc.invalidateQueries({
        predicate: ({ queryKey }) => isPostListKey(queryKey) || isPostDetailKey(queryKey),
      });

      return result;
    },
    [updater, qc, mutateAsync]
  );

  return { run, isPending };
}
