import { createOptimisticUpdater, movePostsFromList, usePostMove, type PostMoveRequest } from "@/entities/post";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function usePostMoveAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = usePostMove();

  const updater = createOptimisticUpdater(qc, movePostsFromList);

  const run = useCallback(
    async (postIds: number[], targetBoardId: number) => {
      const ids = Array.from(new Set(postIds)).filter((n) => Number.isFinite(n));
      if (ids.length === 0) return;

      const payload = {
        postIds: new Set(ids),
        targetBoardId,
      };

      const moveRequest: PostMoveRequest = {
        postIds: ids,
        boardId: targetBoardId,
      };

      return updater(payload, () => mutateAsync(moveRequest));
    },
    [updater, mutateAsync]
  );

  return { run, isPending };
}
