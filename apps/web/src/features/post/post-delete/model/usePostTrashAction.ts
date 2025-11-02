import { postQueryKeys, usePostTrash } from "@/entities/post";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function usePostTrashAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = usePostTrash();

  const run = useCallback(async () => {
    const result = await mutateAsync();
    qc.invalidateQueries({ queryKey: postQueryKeys.trashLists() });
    return result;
  }, [mutateAsync]);

  return { run, isPending };
}
