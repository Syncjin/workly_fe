import { usePostCreateAction } from "@/features/post/post-create";
import { closeLoadingOverlay, openLoadingOverlay } from "@/shared/ui/modal/openers";
import { usePostEditorState } from "@/widgets/post-editor/model/PostEditorStore";
import { Button } from "@workly/ui";
import { useCallback } from "react";
import { toolbar } from "./postEditor.css";

export default function ArticleWriteActions() {
  const { boardId, title, html } = usePostEditorState();
  const { run, isPending } = usePostCreateAction();

  const handleSubmit = useCallback(async () => {
    if (boardId == null) return alert("게시판을 선택해주세요.");
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (!html.trim()) return alert("내용을 입력해주세요.");

    openLoadingOverlay();
    try {
      const res = await run({ post: { boardId, title, content: html } });
      console.log("res", res);
    } catch (error) {
      closeLoadingOverlay();
    } finally {
      closeLoadingOverlay();
    }
  }, [boardId, title, html]);

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
