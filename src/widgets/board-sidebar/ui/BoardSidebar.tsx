"use client";

import { Button } from "@/shared/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useSidebarBoards } from "../model/useSidebarBoard";
import CollapsibleBoardTree from "./CollapsibleBoardTree";
import * as styles from "./boardSidebar.css";
interface BoardSidebarProps {
  className?: string;
  style?: React.CSSProperties;
}

export const BoardSidebar = ({ className, style }: BoardSidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current board ID from URL
  const currentBoardId = searchParams?.get("boardId") || null;
  const [active, setActive] = useState<number | null>(0);
  const { data = [], isLoading, isError, error, isFetching, refetch } = useSidebarBoards();
  console.log("Data", data);



  if (isLoading) {
    return <div>로딩중</div>
  }

  const onCreatePost = () => { }

  return <aside className={[styles.container, className].filter(Boolean).join(" ")} style={style} aria-label="Sidebar Navigation">
    <div className={styles.headerArea}>
      <Button size="sm" className={styles.createBtn} color="brand-600" onClick={onCreatePost} type="button">
        글쓰기
      </Button>
    </div>

    <div className={styles.divider} role="separator" />

    <CollapsibleBoardTree data={data} activeBoardId={active ?? undefined} onSelectBoard={(b) => setActive(b.id)} defaultExpandedCategoryIds={[1]} />
  </aside>
};
