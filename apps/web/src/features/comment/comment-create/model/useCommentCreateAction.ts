import { CommentCreateRequest, useCommentCreate } from "@/entities/comment";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function useCommentCreateAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = useCommentCreate();

  const run = useCallback(
    async ({ content, postId }: CommentCreateRequest) => {
      return await mutateAsync({ content, postId });
    },
    [qc, mutateAsync]
  );

  return { run, isPending };
}
