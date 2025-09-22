"use client";
import { useBoardDetailSuspense } from "@/entities/board";
import * as styles from "./postList.css";

export function BoardHeader({ boardId }: { boardId?: number | null }) {
  if (!Number.isFinite(boardId) || (boardId as number) <= 0) {
    return <h1 className={styles.header}>게시판</h1>;
  }
  return <BoardHeaderData boardId={boardId as number} />;
}

function BoardHeaderData({ boardId }: { boardId: number }) {
  const { data: board } = useBoardDetailSuspense({ boardId }, { staleTime: 5 * 60 * 1000, select: (resp) => resp.data });
  return <h1 className={styles.header}>{board?.boardName ?? "게시판"}</h1>;
}
