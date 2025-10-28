"use client";

import { Icon, Tooltip } from "@workly/ui";
import { useCallback } from "react";
import type { SidebarBoard, SidebarGroup } from "../model/useSidebarBoard";
import * as styles from "./collapsedBoardTree.css";

interface CollapsedBoardTreeProps {
  data: SidebarGroup[];
  activeBoardId?: number | null;
  onSelectBoard?: (board: SidebarBoard) => void;
  className?: string;
}

export const CollapsedBoardTree: React.FC<CollapsedBoardTreeProps> = ({ data, activeBoardId, onSelectBoard, className }) => {
  const handleSelect = useCallback(
    (board: SidebarBoard) => () => {
      onSelectBoard?.(board);
    },
    [onSelectBoard]
  );

  // 모든 게시판을 평면화하여 표시
  const allBoards = data.flatMap((group) =>
    group.boards.map((board) => ({
      ...board,
      categoryName: group.category.name,
    }))
  );

  return (
    <nav className={[styles.nav, className].filter(Boolean).join(" ")} data-ui="collapsed-board-tree">
      <ul className={styles.boardList} role="list">
        {allBoards.map((board) => {
          const active = board.id === activeBoardId;
          const tooltipContent = `${board.categoryName} > ${board.name}`;

          return (
            <li key={board.id} className={styles.boardItem}>
              <Tooltip content={tooltipContent} position="right">
                <button type="button" onClick={handleSelect(board)} className={styles.boardButton({ active })} aria-label={`${board.categoryName} - ${board.name} 게시판`} aria-current={active ? "page" : undefined}>
                  <Icon name="file-list-line" color={active ? "brand-600" : "gray-600"} size={{ width: 16, height: 16 }} />
                </button>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CollapsedBoardTree;
