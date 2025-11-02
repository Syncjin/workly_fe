import { postApi, postQueryKeys } from "@/entities/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function usePostTrashAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => postApi.deletePostsTrash(),
    onSuccess: () => {
      // 휴지통 목록 갱신
      qc.invalidateQueries({ queryKey: postQueryKeys.trashLists() });
    },
  });

  const run = useCallback(async () => {
    return mutateAsync();
  }, [mutateAsync]);

  return { run, isPending };
}
