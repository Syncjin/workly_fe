"use client";

import { AdminBoardLink } from "@/features/board/board-manage";
import { useSidebar } from "@/lib/providers/SidebarProvider";
import { openBoardSelect } from "@/shared/ui/modal/openers";
import CollapsedBoardTree from "@/widgets/board-sidebar/ui/CollapsedBoardTree";
import { Button, Icon, Tooltip } from "@workly/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { startTransition, useCallback, useMemo, useState } from "react";
import { SidebarBoard, useSidebarBoardsSuspense } from "../model/useSidebarBoard";
import CollapsibleBoardTree from "./CollapsibleBoardTree";
import { PostFilter } from "./PostFilter";
import TrashBin from "./TrashBin";
import * as styles from "./boardSidebar.css";
import * as treeStyles from "./collapsibleBoardTree.css";

interface BoardSidebarProps {
  className?: string;
  style?: React.CSSProperties;
}

const Chevron = React.memo<{ open: boolean }>(({ open }) => (
  <span className={treeStyles.chevron} data-open={open ? "true" : "false"} aria-hidden>
    <Icon name="arrow-right-s-line" size={{ width: 16, height: 16 }} />
  </span>
));
Chevron.displayName = "Chevron";

export const BoardSidebar = ({ className, style }: BoardSidebarProps) => {
  const headerId = "all-boards-header";
  const panelId = "all-boards-panel";
  const [isBoardListVisible, setIsBoardListVisible] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // 사이드바 축소/확장 상태 가져오기
  const { isCollapsed } = useSidebar();

  const { data = [] } = useSidebarBoardsSuspense();

  const currentFilter = React.useMemo(() => {
    return pathname?.slice(1, pathname.length);
  }, [pathname]);

  const onCreatePost = useCallback(async () => {
    const sp = new URLSearchParams(searchParams?.toString() ?? "");
    let boardId = sp.get("boardId");
    if (!boardId) {
      const res = await openBoardSelect();
      if (res?.board) {
        boardId = res?.board.id;
      }
    }

    if (boardId) {
      startTransition(() => {
        router.push(`/article/write?boardId=${boardId}`, { scroll: false });
      });
    }
  }, [searchParams, router]);

  const activeBoardId = useMemo(() => {
    const v = searchParams?.get("boardId");
    const n = v ? Number(v) : NaN;
    return Number.isFinite(n) ? n : undefined;
  }, [searchParams]);

  const defaultExpandedCategoryIds = useMemo(() => {
    if (!activeBoardId) return [1]; // 기존 기본값 유지
    const found = data.find((cat) => cat.boards?.some((b) => b.id === activeBoardId));
    return found ? [found?.category.id] : [1];
  }, [data, activeBoardId]);

  const toggleBoardList = useCallback(() => {
    setIsBoardListVisible((prev) => !prev);
  }, []);

  const onBoardListKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleBoardList();
      }
    },
    [toggleBoardList]
  );

  const onSelectBoard = useCallback(
    (b: SidebarBoard) => {
      const sp = new URLSearchParams(searchParams?.toString() ?? "");
      sp.set("boardId", String(b.id));
      sp.set("categoryId", String(b.categoryId));
      sp.delete("page");
      sp.delete("size");

      startTransition(() => {
        router.push(`/board?${sp.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  return (
    <aside className={[styles.container, className].filter(Boolean).join(" ")} style={style} aria-label="Sidebar Navigation">
      <nav className={styles.navContainer}>
        <div className={`${styles.headerArea} ${styles.createBtnContainer}`}>
          {isCollapsed ? (
            <Tooltip content="새 글 작성" position="right">
              <Button size="sm" className={`${styles.createBtn} ${styles.collapsedCreateBtn}`} color="brand-600" onClick={onCreatePost} type="button" aria-label="글쓰기">
                <Icon name="add-line" size={{ width: 14, height: 14 }} />
              </Button>
            </Tooltip>
          ) : (
            <Button size="sm" className={styles.createBtn} color="brand-600" onClick={onCreatePost} type="button">
              글쓰기
            </Button>
          )}
        </div>

        <PostFilter isCollapsed={isCollapsed} currentFilter={currentFilter} />

        <div className={styles.divider} role="separator" />

        {isCollapsed ? (
          <div className={styles.collapsedBoardArea}>
            <Tooltip content="전체 게시판" position="right">
              <button type="button" onClick={toggleBoardList} onKeyDown={onBoardListKeyDown} aria-expanded={isBoardListVisible} aria-label={isBoardListVisible ? "전체 게시판 목록 숨기기" : "전체 게시판 목록 보기"} className={styles.collapsedBoardIcon}>
                <Icon name="list-unordered" size={{ width: 20, height: 20 }} />
              </button>
            </Tooltip>

            {isBoardListVisible && (
              <div className={styles.collapsedBoardList}>
                <CollapsedBoardTree data={data} activeBoardId={activeBoardId} onSelectBoard={onSelectBoard} />
              </div>
            )}
          </div>
        ) : (
          <div className={styles.expandedContent}>
            <div className={styles.boardManageRow}>
              <button type="button" onClick={() => toggleBoardList()} onKeyDown={onBoardListKeyDown} aria-expanded={isBoardListVisible} data-state={isBoardListVisible ? "open" : "closed"} data-role="board-manage" className={treeStyles.headerButton({ open: isBoardListVisible })}>
                <Chevron open={isBoardListVisible} />
                {!isCollapsed && <span className={styles.boardManageText}>전체 게시판</span>}
              </button>

              <AdminBoardLink className={styles.boardManageBtn}>관리</AdminBoardLink>
            </div>
            <div id={panelId} role="region" aria-labelledby={headerId} hidden={!isBoardListVisible}>
              <CollapsibleBoardTree data={data} activeBoardId={activeBoardId} onSelectBoard={onSelectBoard} defaultExpandedCategoryIds={defaultExpandedCategoryIds} />
            </div>
          </div>
        )}
        {!isCollapsed ? (
          <>
            <div className={styles.divider} role="separator" />
            <div className={styles.trashBinContainer}>
              <TrashBin isCollapsed={isCollapsed} currentFilter={currentFilter} />
            </div>
          </>
        ) : (
          <div className={styles.collapsedTrashBin}>
            <TrashBin isCollapsed={isCollapsed} currentFilter={currentFilter} />
          </div>
        )}
      </nav>
    </aside>
  );
};
