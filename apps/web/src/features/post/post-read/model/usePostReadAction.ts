import { createOptimisticUpdater, patchListDataAsRead, usePostRead } from "@/entities/post";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function usePostReadAction() {
  const qc = useQueryClient();
  const { mutateAsync } = usePostRead();

  const updater = createOptimisticUpdater(qc, patchListDataAsRead);

  const run = useCallback(
    async (postIds: number[]) => {
      const ids = Array.from(new Set(postIds));
      if (ids.length === 0) return;

      const idSet = new Set(ids);
      return updater(idSet, () => mutateAsync({ postIds: ids }));
    },
    [updater, mutateAsync]
  );

  return { run };
}
