import { usePostCreate } from "@/entities/post";
import { useQueryClient } from "@tanstack/react-query";
import { PostCreateRequest } from "@workly/types";
import { useCallback } from "react";

type RunArgs = {
  post: PostCreateRequest;
  files?: File[];
};

export function usePostCreateAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = usePostCreate();

  const run = useCallback(
    async ({ post, files }: RunArgs) => {
      if (!post.title?.trim()) throw new Error("제목을 입력해주세요.");
      if (!post.content?.trim()) throw new Error("내용을 입력해주세요.");
      if (!post.boardId) throw new Error("게시판을 선택해주세요.");

      return await mutateAsync({ post, files });
    },
    [qc, mutateAsync]
  );

  return { run, isPending };
}
