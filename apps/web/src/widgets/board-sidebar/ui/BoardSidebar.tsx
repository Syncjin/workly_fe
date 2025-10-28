"use client";

import { AdminBoardLink } from "@/features/board/board-manage";
import { useSidebar } from "@/lib/providers/SidebarProvider";
import { openBoardSelect } from "@/shared/ui/modal/openers";
import { Button, Icon, Tooltip } from "@workly/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { SidebarBoard, useSidebarBoardsSuspense } from "../model/useSidebarBoard";
import CollapsedBoardTree from "./CollapsedBoardTree";
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCollapsedBoardListVisible, setIsCollapsedBoardListVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 사이드바 축소/확장 상태 가져오기
  const { isCollapsed } = useSidebar();

  const { data = [] } = useSidebarBoardsSuspense();

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
  }, [searchParams]);

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

  const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
    <span className={treeStyles.chevron} data-open={open ? "true" : "false"} aria-hidden>
      <Icon name="arrow-right-s-line" size={{ width: 16, height: 16 }} />
    </span>
  );

  const toggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const toggleCollapsedBoardList = useCallback(() => {
    setIsCollapsedBoardListVisible((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isCollapsed) {
      setIsCollapsedBoardListVisible(false);
    }
  }, [isCollapsed]);

  const onHeaderKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
    [toggle]
  );

  const onCollapsedBoardKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleCollapsedBoardList();
      }
    },
    [toggleCollapsedBoardList]
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
    [pathname, router, searchParams]
  );

  return (
    <aside className={[styles.container, className].filter(Boolean).join(" ")} style={style} aria-label="Sidebar Navigation">
      <div className={`${styles.headerArea} ${styles.createBtnContainer}`}>
        {isCollapsed ? (
          <Tooltip content="새 글 작성" position="right">
            <Button size="sm" className={`${styles.createBtn} ${styles.collapsedCreateBtn}`} color="brand-600" onClick={onCreatePost} type="button" aria-label="글쓰기">
              <Icon name="add-line" size={{ width: 14, height: 14 }} />
            </Button>
          </Tooltip>
        ) : (
          // 확장 상태: 전체 글쓰기 버튼 표시
          <Button size="sm" className={styles.createBtn} color="brand-600" onClick={onCreatePost} type="button">
            글쓰기
          </Button>
        )}
      </div>

      <div className={styles.divider} role="separator" />

      {isCollapsed ? (
        // 축소 상태: 게시판 아이콘과 개별 게시판 목록 표시
        <div className={styles.collapsedBoardArea}>
          <Tooltip content="전체 게시판" position="right">
            <button type="button" onClick={toggleCollapsedBoardList} onKeyDown={onCollapsedBoardKeyDown} aria-expanded={isCollapsedBoardListVisible} aria-label={isCollapsedBoardListVisible ? "전체 게시판 목록 숨기기" : "전체 게시판 목록 보기"} className={styles.collapsedBoardIcon}>
              <Icon name="list-unordered" size={{ width: 20, height: 20 }} />
            </button>
          </Tooltip>

          {/* 축소된 상태에서 개별 게시판 목록 표시 */}
          {isCollapsedBoardListVisible && (
            <div className={styles.collapsedBoardList}>
              <CollapsedBoardTree data={data} activeBoardId={activeBoardId} onSelectBoard={onSelectBoard} />
            </div>
          )}
        </div>
      ) : (
        // 확장 상태: 전체 게시판 영역 표시
        <div className={styles.expandedContent}>
          <div className={styles.boardManageRow}>
            <button type="button" onClick={() => toggle()} onKeyDown={onHeaderKeyDown} aria-expanded={isExpanded} data-state={isExpanded ? "open" : "closed"} data-role="board-manage" className={treeStyles.headerButton({ open: isExpanded })}>
              <Chevron open={isExpanded} />
              {!isCollapsed && <span className={styles.boardManageText}>전체 게시판</span>}
            </button>

            <AdminBoardLink className={styles.boardManageBtn}>관리</AdminBoardLink>
          </div>
          <div id={panelId} role="region" aria-labelledby={headerId} hidden={!isExpanded}>
            <CollapsibleBoardTree data={data} activeBoardId={activeBoardId} onSelectBoard={onSelectBoard} defaultExpandedCategoryIds={defaultExpandedCategoryIds} />
          </div>
        </div>
      )}
    </aside>
  );
};
