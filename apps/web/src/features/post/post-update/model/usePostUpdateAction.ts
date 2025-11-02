import { isPostDetailKey, isPostListKey, usePostUpdate } from "@/entities/post";
import { useQueryClient } from "@tanstack/react-query";
import { PostCreateRequest, PostUpdateRequest } from "@workly/types";
import { useCallback } from "react";

type RunArgs = {
  params: PostUpdateRequest;
  post: PostCreateRequest;
  files?: File[];
};

export function usePostUpdateAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = usePostUpdate();

  // 수정 후
  const run = useCallback(
    async ({ params, post, files }: RunArgs) => {
      if (!post.title?.trim()) throw new Error("제목을 입력해주세요.");
      if (!post.content?.trim()) throw new Error("내용을 입력해주세요.");
      if (!post.boardId) throw new Error("게시판을 선택해주세요.");

      // 낙관적 업데이트 준비
      await qc.cancelQueries({ predicate: ({ queryKey }) => isPostDetailKey(queryKey) });
      const snapshots = qc.getQueriesData({ predicate: ({ queryKey }) => isPostDetailKey(queryKey) });
      console.log("snapshots", snapshots);

      try {
        return await mutateAsync({ params, post, files });
      } catch (error) {
      } finally {
        // 목록 업데이트도 필요
        qc.invalidateQueries({ predicate: ({ queryKey }) => isPostDetailKey(queryKey) });
        qc.invalidateQueries({ predicate: ({ queryKey }) => isPostListKey(queryKey) });
      }
    },
    [qc, mutateAsync]
  );

  return { run, isPending };
}
