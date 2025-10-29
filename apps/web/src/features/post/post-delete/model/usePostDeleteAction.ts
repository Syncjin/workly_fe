import { createOptimisticUpdater, removeIdsFromList, usePostDelete } from "@/entities/post";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function usePostDeleteAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = usePostDelete();

  const updater = createOptimisticUpdater(qc, removeIdsFromList);

  const run = useCallback(
    async (postIds: number[]) => {
      const ids = Array.from(new Set(postIds)).filter((n) => Number.isFinite(n));
      if (ids.length === 0) return;

      const idSet = new Set(ids);
      return updater(idSet, () => mutateAsync({ postIds: ids }));
    },
    [updater, mutateAsync]
  );

  return { run, isPending };
}
