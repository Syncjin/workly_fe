"use client";

import { AdminBoardLink } from "@/features/board/board-manage";
import { Button } from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import { usePathname, useRouter } from "next/navigation";
import React, { startTransition, useCallback, useState } from "react";
import { SidebarBoard, useSidebarBoardsSuspense } from "../model/useSidebarBoard";
import CollapsibleBoardTree from "./CollapsibleBoardTree";
import * as styles from "./boardSidebar.css";
import * as treeStyles from "./collapsibleBoardTree.css";
interface BoardSidebarProps {
  className?: string;
  style?: React.CSSProperties;
}

export const BoardSidebar = ({ className, style }: BoardSidebarProps) => {
  const headerId = "all-boards-header";
  const panelId = "all-boards-panel";
  const [active, setActive] = useState<number | null>(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { data = [], isFetching, refetch } = useSidebarBoardsSuspense();
  const onCreatePost = () => {};

  const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
    <span className={treeStyles.chevron} data-open={open ? "true" : "false"} aria-hidden>
      <Icon name="arrow-right-s-line" size={{ width: 16, height: 16 }} />
    </span>
  );

  const toggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const onHeaderKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
    [toggle]
  );

  const onSelectBoard = useCallback(
    (b: SidebarBoard) => {
      setActive(b.id);
      const searchParams = new URLSearchParams();
      searchParams.set("boardId", String(b.id));
      searchParams.set("categoryId", String(b.categoryId));
      searchParams.set("page", String(1));
      searchParams.set("size", String(10));
      startTransition(() => {
        router?.push(`${pathname}?${searchParams.toString()}`, { scroll: false });
      });
    },
    [pathname, router]
  );

  return (
    <aside className={[styles.container, className].filter(Boolean).join(" ")} style={style} aria-label="Sidebar Navigation">
      <div className={styles.headerArea}>
        <Button size="sm" className={styles.createBtn} color="brand-600" onClick={onCreatePost} type="button">
          글쓰기
        </Button>
      </div>

      <div className={styles.divider} role="separator" />

      <div className={styles.boardManageRow}>
        <button type="button" onClick={() => toggle()} onKeyDown={onHeaderKeyDown} aria-expanded={isExpanded} data-state={isExpanded ? "open" : "closed"} data-role="board-manage" className={treeStyles.headerButton({ open: isExpanded })}>
          <Chevron open={isExpanded} />
          <span className={styles.boardManageText}>전체 게시판</span>
        </button>

        <AdminBoardLink className={styles.boardManageBtn}>관리</AdminBoardLink>
      </div>
      <div id={panelId} role="region" aria-labelledby={headerId} hidden={!isExpanded}>
        <CollapsibleBoardTree data={data} activeBoardId={active ?? undefined} onSelectBoard={onSelectBoard} defaultExpandedCategoryIds={[1]} />
      </div>
    </aside>
  );
};
