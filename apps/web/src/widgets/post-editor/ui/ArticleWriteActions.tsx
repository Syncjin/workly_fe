import { usePostCreateAction } from "@/features/post/post-create";
import { usePostUpdateAction, usePostUpdateMoveAction } from "@/features/post/post-update";
import { closeLoadingOverlay, openLoadingOverlay } from "@/shared/ui/modal/openers";
import { usePostEditorState } from "@/widgets/post-editor/model/PostEditorStore";
import { Button } from "@workly/ui";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toolbar } from "./postEditor.css";

export default function ArticleWriteActions() {
  const { board, title, json, post } = usePostEditorState();
  const { run: createRun } = usePostCreateAction();
  const { run: updateRun } = usePostUpdateAction();
  const { run: updateMoveRun } = usePostUpdateMoveAction();
  const router = useRouter();

  const handleSubmit = useCallback(async () => {
    if (!board?.id) return alert("게시판을 선택해주세요.");
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (!json) return alert("내용을 입력해주세요.");

    openLoadingOverlay();
    try {
      if (post) {
        const res = await updateRun({ params: { postId: post.postId }, post: { boardId: board?.id, title, content: json } });

        if (post.board.boardId !== board.id) {
          // 게시판 이동.
          const updateReq = { params: { postId: post.postId }, post: { boardId: board?.id, title, content: json } };
          const moveReq = { boardId: board.id, postIds: [post.postId] };
          const res = await updateMoveRun({ updateReq, moveReq });
          if (res?.updateRes?.data.postId) {
            router.push(`/article/${res.updateRes?.data.postId}`);
          }
        } else {
          const res = await updateRun({ params: { postId: post.postId }, post: { boardId: board?.id, title, content: json } });
          if (res?.data.postId) {
            router.push(`/article/${res.data.postId}`);
          }
        }
      } else {
        const res = await createRun({ post: { boardId: board.id, title, content: json } });
        console.log("res", res);
        if (res?.data?.postId) {
          router.push(`/article/${res.data.postId}`);
        }
      }
    } catch (error) {
      closeLoadingOverlay();
    } finally {
      closeLoadingOverlay();
    }
  }, [board?.id, title, json]);

  return (
    <div className={toolbar.container}>
      <div className={toolbar.leftArea}>
        <Button onClick={handleSubmit}>등록</Button>
        <Button variant="border" color="gray-900">
          필독/공지
        </Button>
      </div>
    </div>
  );
}
