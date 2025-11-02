import { isPostDetailKey, isPostListKey, usePostMove, usePostUpdate } from "@/entities/post";
import { log } from "@/lib/logger";
import { useQueryClient } from "@tanstack/react-query";
import { PostCreateRequest, PostMoveRequest, PostUpdateRequest } from "@workly/types";
import { useCallback } from "react";

type RunArgs = {
  updateReq: UpdateReq;
  moveReq: PostMoveRequest;
};

type UpdateReq = {
  params: PostUpdateRequest;
  post: PostCreateRequest;
  files?: File[];
};

export function usePostUpdateMoveAction() {
  const qc = useQueryClient();
  const updateQ = usePostUpdate();
  const moveQ = usePostMove();

  async function updateThenMove(updateReq: UpdateReq, moveReq: PostMoveRequest) {
    const updateRes = await updateQ.mutateAsync(updateReq);
    const moveRes = await moveQ.mutateAsync(moveReq);
    return { updateRes, moveRes };
  }

  const run = useCallback(
    async ({ updateReq, moveReq }: RunArgs) => {
      if (!updateReq.post.title?.trim()) throw new Error("제목을 입력해주세요.");
      if (!updateReq.post.content?.trim()) throw new Error("내용을 입력해주세요.");
      if (!updateReq.post.boardId) throw new Error("게시판을 선택해주세요.");

      try {
        const result = await updateThenMove(updateReq, moveReq);
        qc.invalidateQueries({ predicate: ({ queryKey }) => isPostDetailKey(queryKey) });
        qc.invalidateQueries({ predicate: ({ queryKey }) => isPostListKey(queryKey) });
        return result;
      } catch (error) {
        log.error("usePostUpdateMoveAction error", error);
      }
    },
    [qc, updateQ, moveQ]
  );

  const isPending = updateQ.isPending || moveQ.isPending;
  return { run, isPending };
}
