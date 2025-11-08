import { cx } from "@/shared/styles/classes";
import { Icon } from "@workly/ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SidebarBoard, SidebarGroup } from "../model/useSidebarBoard";
import * as styles from "./collapsibleBoardTree.css";

interface CollapsibleBoardTreeProps {
  data: SidebarGroup[];
  activeBoardId?: number | null;
  onSelectBoard?: (board: SidebarBoard) => void;
  defaultExpandedCategoryIds?: number[];
  className?: string;
}

export const CollapsibleBoardTree = ({ data, activeBoardId, onSelectBoard, defaultExpandedCategoryIds, className }: CollapsibleBoardTreeProps) => {
  const autoExpandedFromActive = useMemo(() => {
    if (activeBoardId == null) return new Set<number>();
    const catId = data.find((g) => g.boards.some((b) => b.id === activeBoardId))?.category.id;
    const n = Number(catId);
    return Number.isFinite(n) ? new Set<number>([n]) : new Set<number>();
  }, [activeBoardId, data]);

  const initialExpanded = useMemo(() => {
    const fromDefault = (defaultExpandedCategoryIds ?? []).map(Number);
    if (fromDefault.length > 0) return new Set<number>(fromDefault);
    return new Set<number>(Array.from(autoExpandedFromActive)); // fallback
  }, [defaultExpandedCategoryIds, autoExpandedFromActive]);

  const [expanded, setExpanded] = useState<Set<number>>(initialExpanded);

  useEffect(() => {
    setExpanded(new Set(initialExpanded));
  }, [initialExpanded]);

  const isExpanded = useCallback(
    (categoryId: number | string) => {
      return expanded.has(Number(categoryId));
    },
    [expanded]
  );

  const toggle = useCallback((categoryId: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }, []);

  const onHeaderKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, categoryId: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(categoryId);
      }
    },
    [toggle]
  );

  const handleSelect = useCallback(
    (board: SidebarBoard) => () => {
      onSelectBoard?.(board);
    },
    [onSelectBoard]
  );

  const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
    <span className={styles.chevron} data-open={open ? "true" : "false"} aria-hidden>
      <Icon name="arrow-right-s-line" size={{ width: 16, height: 16 }} />
    </span>
  );

  return (
    <div className={cx(styles.nav, className)} data-ui="board-tree">
      <ul className={styles.rootList} role="tree">
        {data.map(({ category, boards }) => {
          const expandedNow = isExpanded(category.id);

          return (
            <li key={category.id} role="treeitem" aria-expanded={expandedNow} className={styles.categoryItem}>
              <button
                type="button"
                onClick={() => toggle(category.id)}
                onKeyDown={(e) => onHeaderKeyDown(e, category.id)}
                aria-expanded={expandedNow}
                aria-controls={`panel-${category.id}`}
                data-state={expandedNow ? "open" : "closed"}
                data-role="category-header"
                className={styles.headerButton({ open: expandedNow })}
              >
                <Chevron open={expandedNow} />
                <span className={styles.headerText}>{category.name}</span>
              </button>
              <div id={`panel-${category.id}`} role="group" hidden={!expandedNow} className={styles.panel}>
                <ul className={styles.boardList}>
                  {boards.map((board) => {
                    const active = board.id === activeBoardId;
                    return (
                      <li key={board.id} className={styles.boardItem}>
                        <button type="button" onClick={handleSelect(board)} data-role="board-item" className={styles.boardButton({ active })} aria-current={active ? "true" : undefined}>
                          <Icon name="file-list-line" color={active ? "brand-600" : "gray-600"} size={{ width: 16, height: 16 }} />
                          <span className={styles.boardText}>{board.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CollapsibleBoardTree;
