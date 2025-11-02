import { usePostCreateAction } from "@/features/post/post-create";
import { usePostMustReadAction } from "@/features/post/post-must-read/model/usePostMustReadAction";
import { usePostUpdateAction, usePostUpdateMoveAction } from "@/features/post/post-update";
import { log } from "@/lib/logger";
import { closeLoadingOverlay, openLoadingOverlay } from "@/shared/ui/modal/openers";
import { usePostEditorActions, usePostEditorState } from "@/widgets/post-editor/model/PostEditorStore";
import { Button, Icon } from "@workly/ui";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toolbar } from "./postEditor.css";

export default function ArticleWriteActions({ editor }: { editor: React.RefObject<import("@workly/editor").EditorRef | null> }) {
  const { board, boardId, title, json, post, isMustRead } = usePostEditorState();
  const { setMustRead, setMustReadChanged } = usePostEditorActions();
  const { run: createRun } = usePostCreateAction();
  const { run: updateRun } = usePostUpdateAction();
  const { run: updateMoveRun } = usePostUpdateMoveAction();
  const { run: mustReadRun, isPending: isMustReadPending } = usePostMustReadAction();
  const router = useRouter();

  // 게시글 로드 시 필독 상태 초기화
  useEffect(() => {
    if (post?.mustRead !== undefined) {
      setMustRead(post.mustRead);
    }
  }, [post?.mustRead, setMustRead]);

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
            // 게시글 수정 완료 후 필독 변경 상태 초기화
            setMustReadChanged(false);
            router.push(`/article/${res.updateRes.data.postId}`);
          }
        } else {
          const res = await updateRun({
            params: { postId: post.postId },
            post: { boardId: resultBoardId, title, content: finalJSON },
          });
          if (res?.data.postId) {
            // 게시글 수정 완료 후 필독 변경 상태 초기화
            setMustReadChanged(false);
            router.push(`/article/${res.data.postId}`);
          }
        }
      } else {
        const res = await createRun({
          post: { boardId: boardId!, title, content: finalJSON },
        });
        console.log("게시물 생성 결과:", res);
        if (res?.data?.postId) {
          if (isMustRead) {
            try {
              await mustReadRun(res.data.postId);
              console.log("필독 설정 완료:", res.data.postId);
            } catch (error) {
              console.error("필독 설정 실패:", error);
            }
          }
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
  }, [boardId, board, title, json, post, editor, createRun, updateRun, updateMoveRun, router, isMustRead, mustReadRun, setMustReadChanged]);

  const handleMustReadToggle = useCallback(async () => {
    const newMustReadValue = !isMustRead;
    setMustRead(newMustReadValue);

    // 게시글 수정 모드에서 필독 상태 변경 시 즉시 API 호출
    if (post?.postId) {
      try {
        await mustReadRun(post.postId);
        setMustReadChanged(true); // 필독 상태가 변경되었음을 표시

        console.log("필독 상태 변경 완료:", post.postId, newMustReadValue);
      } catch (error) {
        // API 호출 실패 시 원래 상태로 되돌리기
        setMustRead(isMustRead);
        console.error("필독 상태 변경 실패:", error);
      }
    }
  }, [setMustRead, isMustRead, post, mustReadRun, setMustReadChanged, isMustReadPending]);

  return (
    <div className={toolbar.container}>
      <div className={toolbar.leftArea}>
        <Button onClick={handleSubmit}>등록</Button>
        <Button variant="border" color={isMustRead ? "blue-600" : "gray-900"} onClick={handleMustReadToggle} disabled={isMustReadPending} title={"필독 설정"}>
          <Icon name="check-line" color={isMustRead ? "blue-600" : "gray-900"} />
          필독
        </Button>
      </div>
    </div>
  );
}
