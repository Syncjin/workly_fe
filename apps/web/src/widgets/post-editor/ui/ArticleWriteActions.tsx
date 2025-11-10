import { usePostCreateAction } from "@/features/post/post-create";
import { usePostMustReadAction, usePostMustReadDeleteAction } from "@/features/post/post-must-read";
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
  const { run: mustReadRun } = usePostMustReadAction();
  const { run: mustReadDeleteRun } = usePostMustReadDeleteAction();
  const router = useRouter();

  // 게시글 로드 시 필독 상태 초기화
  useEffect(() => {
    if (post?.mustRead !== undefined) {
      setMustRead(post.mustRead);
    }
  }, [post?.mustRead, setMustRead]);

  // 필독 상태 처리
  const handleMustReadChange = useCallback(
    async (postId: number, originalMustRead: boolean) => {
      if (originalMustRead === isMustRead) return;

      try {
        if (isMustRead) {
          await mustReadRun(postId);
          console.log("필독 설정 완료:", postId);
        } else {
          await mustReadDeleteRun(postId);
          console.log("필독 해제 완료:", postId);
        }
      } catch (error) {
        console.error("필독 상태 변경 실패:", error);
      }
    },
    [isMustRead, mustReadRun, mustReadDeleteRun]
  );

  // 게시글 생성
  const handleCreate = useCallback(
    async (finalJSON: string) => {
      const res = await createRun({
        post: { boardId: boardId!, title, content: finalJSON },
      });

      if (res?.data?.postId) {
        if (isMustRead) {
          await handleMustReadChange(res.data.postId, false);
        }
        router.push(`/article/${res.data.postId}`);
      }
    },
    [boardId, title, createRun, isMustRead, handleMustReadChange, router]
  );

  // 게시글 수정
  const handleUpdate = useCallback(
    async (finalJSON: string) => {
      if (!post) return;

      const resultBoardId = board?.id ?? boardId;
      const originalMustRead = post.mustRead;
      const isBoardChanged = post.board.boardId !== resultBoardId;

      let postId: number | undefined;

      if (isBoardChanged) {
        const updateReq = {
          params: { postId: post.postId },
          post: { boardId: resultBoardId!, title, content: finalJSON },
        };
        const moveReq = { boardId: resultBoardId!, postIds: [post.postId] };
        const res = await updateMoveRun({ updateReq, moveReq });
        postId = res?.updateRes?.data.postId;
      } else {
        const res = await updateRun({
          params: { postId: post.postId },
          post: { boardId: resultBoardId!, title, content: finalJSON },
        });
        postId = res?.data.postId;
      }

      if (postId) {
        await handleMustReadChange(postId, originalMustRead);
        setMustReadChanged(false);
        router.push(`/article/${postId}`);
      }
    },
    [post, board, boardId, title, updateRun, updateMoveRun, handleMustReadChange, setMustReadChanged, router]
  );

  const handleSubmit = useCallback(async () => {
    if (!boardId) return alert("게시판을 선택해주세요.");
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (!json) return alert("내용을 입력해주세요.");

    openLoadingOverlay();
    try {
      const finalJSON = (await editor.current?.submit()) || json;

      if (post) {
        await handleUpdate(finalJSON);
      } else {
        await handleCreate(finalJSON);
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
  }, [boardId, title, json, post, editor, handleCreate, handleUpdate]);

  const handleMustReadToggle = useCallback(() => {
    setMustRead(!isMustRead);
  }, [setMustRead, isMustRead]);

  return (
    <div className={toolbar.container}>
      <div className={toolbar.leftArea}>
        <Button onClick={handleSubmit}>등록</Button>
        <Button variant="border" color={isMustRead ? "blue-600" : "gray-900"} onClick={handleMustReadToggle} title={isMustRead ? "필독 해제" : "필독 설정"}>
          <Icon name="check-line" color={isMustRead ? "blue-600" : "gray-900"} />
          필독
        </Button>
      </div>
    </div>
  );
}
