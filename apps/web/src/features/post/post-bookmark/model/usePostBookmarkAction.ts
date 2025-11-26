import { createOptimisticUpdater, isPostDetailKey, isPostListKey, patchAnyBookmark, Post, usePostBookmarks } from "@/entities/post";
import { useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@workly/types";
import { useCallback } from "react";

export const usePostBookmarkAction = () => {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = usePostBookmarks();

  const updater = createOptimisticUpdater(qc, patchAnyBookmark);

  const run = useCallback(
    async (postId: number) => {
      const result = (await updater(postId, () => mutateAsync({ postId }))) as ApiResponse<Post>;

      qc.invalidateQueries({
        predicate: ({ queryKey }) => isPostListKey(queryKey) || isPostDetailKey(queryKey),
        refetchType: "all",
      });

      return result;
    },
    [qc, mutateAsync, updater]
  );

  return { run, isPending };
};
