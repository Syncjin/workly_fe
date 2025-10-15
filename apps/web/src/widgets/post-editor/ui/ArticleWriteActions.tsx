import { usePostCreateAction } from "@/features/post/post-create";
import { usePostUpdateAction, usePostUpdateMoveAction } from "@/features/post/post-update";
import { log } from "@/lib/logger";
import { closeLoadingOverlay, openLoadingOverlay } from "@/shared/ui/modal/openers";
import { usePostEditorState } from "@/widgets/post-editor/model/PostEditorStore";
import { Button } from "@workly/ui";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toolbar } from "./postEditor.css";

export default function ArticleWriteActions({ editor }: { editor: React.RefObject<import("@workly/editor").EditorRef | null> }) {
  const { board, boardId, title, json, post } = usePostEditorState();
  const { run: createRun } = usePostCreateAction();
  const { run: updateRun } = usePostUpdateAction();
  const { run: updateMoveRun } = usePostUpdateMoveAction();
  const router = useRouter();

  const handleSubmit = useCallback(async () => {
    if (!boardId) return alert("게시판을 선택해주세요.");
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (!json) return alert("내용을 입력해주세요.");

    openLoadingOverlay();
    try {
      // submit 메서드를 사용하면 이미지 업로드/삭제 및 JSON 변환을 한 번에 처리
      const finalJSON = (await editor.current?.submit()) || json;

      if (post) {
        let resultBoardId = board ? board?.id : boardId;
        if (post.board.boardId !== resultBoardId) {
          const updateReq = {
            params: { postId: post.postId },
            post: { boardId: resultBoardId, title, content: finalJSON },
          };
          const moveReq = { boardId: resultBoardId, postIds: [post.postId] };
          const res = await updateMoveRun({ updateReq, moveReq });
          if (res?.updateRes?.data.postId) {
            router.push(`/article/${res.updateRes.data.postId}`);
          }
        } else {
          const res = await updateRun({
            params: { postId: post.postId },
            post: { boardId: resultBoardId, title, content: finalJSON },
          });
          if (res?.data.postId) {
            router.push(`/article/${res.data.postId}`);
          }
        }
      } else {
        const res = await createRun({
          post: { boardId: boardId!, title, content: finalJSON },
        });
        console.log("게시물 생성 결과:", res);
        if (res?.data?.postId) {
          router.push(`/article/${res.data.postId}`);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        log.error(`게시물 저장 중 오류가 발생했습니다: ${error.message}`, { op: "post-create" });
      } else {
        log.error("게시물 저장 중 오류가 발생했습니다.", { op: "post-create" });
      }
    } finally {
      closeLoadingOverlay();
    }
  }, [boardId, board, title, json, post, editor, createRun, updateRun, updateMoveRun, router]);

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
