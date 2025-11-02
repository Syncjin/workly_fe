/**
 * 게시글 복원 기능 훅 (복원 + 이동)
 */

import { createOptimisticUpdater, postApi, postQueryKeys, removeIdsFromList } from "@/entities/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const usePostRestoreAction = () => {
  const qc = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ postIds, boardId }: { postIds: number[]; boardId: number }) => {
      await postApi.postPostsRestore({ postIds: postIds });
      return postApi.patchPostsMove({ postIds, boardId });
    },
  });

  const updater = createOptimisticUpdater(qc, removeIdsFromList);

  const run = useCallback(
    async (postIds: number[], targetBoardId: number) => {
      const ids = Array.from(new Set(postIds)).filter((n) => Number.isFinite(n));
      if (ids.length === 0) return;

      const idSet = new Set(ids);

      const result = await updater(idSet, () => mutateAsync({ postIds: ids, boardId: targetBoardId }));

      qc.invalidateQueries({ queryKey: postQueryKeys.trashLists() });
      qc.invalidateQueries({ queryKey: postQueryKeys.lists() });

      return result;
    },
    [updater, mutateAsync, qc]
  );

  return { run, isPending };
};
