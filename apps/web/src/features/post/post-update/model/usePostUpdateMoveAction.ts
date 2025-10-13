import { usePostMove, usePostUpdate } from "@/entities/post";
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

export type PostDetailKey = readonly ["posts", "detail", number];

export function isPostDetailKey(qk: unknown): qk is PostDetailKey {
  return Array.isArray(qk) && qk.length === 3 && qk[0] === "posts" && qk[1] === "detail" && typeof qk[2] === "number";
}

function isPostListKey(qk: unknown): boolean {
  return Array.isArray(qk) && qk[0] === "posts" && qk[1] === "list";
}

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
        return await updateThenMove(updateReq, moveReq);
      } catch (error) {
      } finally {
        // 목록 업데이트도 필요
        qc.invalidateQueries({ predicate: ({ queryKey }) => isPostDetailKey(queryKey) });
        qc.invalidateQueries({ predicate: ({ queryKey }) => isPostListKey(queryKey) });
      }
    },
    [qc, updateQ, moveQ]
  );

  const isPending = updateQ.isPending || moveQ.isPending;
  return { run, isPending };
}
