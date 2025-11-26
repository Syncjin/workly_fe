import { openBoardSelect } from "@/shared/ui/modal/openers";
import { usePostEditorActions, usePostEditorStore } from "@/widgets/post-editor/model";
import { useCurrentBoard } from "@/widgets/post-editor/model/useCurrentBoard";
import { Button, Icon, Input } from "@workly/ui";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import * as s from "./postEditor.css";

const parse = (v?: string | null) => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const BoardSelector = () => {
  const searchParams = useSearchParams();
  const initialFromQS = useMemo(() => parse(searchParams?.get("boardId")), [searchParams]);
  const boardId = usePostEditorStore((s) => s.boardId);
  const board = usePostEditorStore((s) => s.board);
  const title = usePostEditorStore((s) => s.title);
  const { setCategory, setBoard, setBoardId, setTitle } = usePostEditorActions();
  const { data } = useCurrentBoard({ boardId: board ? board.id : boardId });

  useEffect(() => {
    if (boardId == null && initialFromQS != null) setBoardId(initialFromQS);
  }, [boardId, initialFromQS, setBoardId]);

  const handleBoardSelect = useCallback(async () => {
    const res = await openBoardSelect({ initialBoardId: board ? board.id : boardId });
    if (res) {
      setBoard(res.board);
      setBoardId(res.board.id);
      setCategory(res.category);
    }
  }, [boardId, board, setBoard, setBoardId, setCategory]);

  return (
    <div className={s.boardSelector.container}>
      <span>게시판</span>
      <div className={s.boardSelector.boardBtnArea}>
        <Button variant="border" size="sm" color="gray-500" onClick={handleBoardSelect}>
          <span>게시판 선택</span>
        </Button>
        <span className={s.boardSelector.categoryName}>{data?.category?.categoryName}</span>
        <Icon name="arrow-right-s-line" color={"gray-500"} size={{ width: 16, height: 16 }} />
        <span className={s.boardSelector.boardName}>{data?.board?.boardName}</span>
      </div>
      <span>제목</span>
      <Input id="title" type="text" placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} />
    </div>
  );
};

export default BoardSelector;
