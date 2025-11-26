import { usePostCreate } from "@/entities/post";
import { PostCreateRequest } from "@workly/types";
import { useCallback } from "react";

type RunArgs = {
  post: PostCreateRequest;
  files?: File[];
};

export function usePostCreateAction() {
  const { mutateAsync, isPending } = usePostCreate();

  const run = useCallback(
    async ({ post, files }: RunArgs) => {
      if (!post.title?.trim()) throw new Error("제목을 입력해주세요.");
      if (!post.content?.trim()) throw new Error("내용을 입력해주세요.");
      if (!post.boardId) throw new Error("게시판을 선택해주세요.");

      return await mutateAsync({ post, files });
    },
    [mutateAsync]
  );

  return { run, isPending };
}
