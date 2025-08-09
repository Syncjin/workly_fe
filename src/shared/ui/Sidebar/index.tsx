"use client";

import React, { useMemo, useState } from "react";
import { Button } from "../Button";
import Icon from "../Icon";
import * as styles from "./sidebar.css";

export type Board = {
  id: string;
  name: string;
  href?: string;
};

export type BoardCategory = {
  id: string;
  name: string;
  icon?: React.ReactNode;
  boards: Board[];
};

type SidebarProps = {
  categories: BoardCategory[];
  onCreatePost?: () => void;
  selectedBoardId?: string; // 활성 보드 ID (컨트롤드)
  defaultOpenCategoryIds?: string[]; // 기본으로 펼쳐둘 카테고리
  onSelectBoard?: (board: Board, cat: BoardCategory) => void;
  className?: string;
  style?: React.CSSProperties;
};

const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <span className={styles.chevron} data-open={open ? "true" : "false"} aria-hidden>
    <Icon name="arrow-right-s-line" size={{ width: 16, height: 16 }} />
  </span>
);

export default function Sidebar({ categories, onCreatePost, selectedBoardId, defaultOpenCategoryIds, onSelectBoard, className, style }: SidebarProps) {
  const defaultOpen = useMemo(() => new Set(defaultOpenCategoryIds ?? []), [defaultOpenCategoryIds]);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    categories.reduce(
      (acc, c) => {
        acc[c.id] = defaultOpen.has(c.id);
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  const toggle = (id: string) => setOpenMap((m) => ({ ...m, [id]: !m[id] }));

  return (
    <aside className={[styles.container, className].filter(Boolean).join(" ")} style={style} aria-label="Sidebar Navigation">
      <div className={styles.headerArea}>
        <Button size="sm" className={styles.createBtn} color="brand-600" onClick={onCreatePost} type="button">
          글쓰기
        </Button>
      </div>

      <div className={styles.divider} role="separator" />

      <nav className={styles.nav} aria-label="게시판 카테고리">
        {categories.map((cat) => {
          const isOpen = openMap[cat.id] ?? false;
          return (
            <section key={cat.id} className={styles.categorySection}>
              <button className={styles.categoryHeader} onClick={() => toggle(cat.id)} aria-expanded={isOpen} aria-controls={`cat-${cat.id}`} type="button">
                <Chevron open={isOpen} />
                {cat.icon && <span className={styles.categoryIcon}>{cat.icon}</span>}
                <span className={styles.categoryName}>{cat.name}</span>
              </button>

              <ul id={`cat-${cat.id}`} className={styles.boardList} data-open={isOpen ? "true" : "false"}>
                {cat.boards.map((b) => {
                  const active = selectedBoardId === b.id;
                  return (
                    <li key={b.id}>
                      {b.href ? (
                        <a
                          href={b.href}
                          className={styles.boardItem}
                          data-active={active ? "true" : "false"}
                          aria-current={active ? "page" : undefined}
                          onClick={(e) => {
                            onSelectBoard?.(b, cat);
                          }}
                        >
                          <Icon name="file-list-line" color="gray-600" size={{ width: 16, height: 16 }} aria-hidden />
                          <span className={styles.boardName}>{b.name}</span>
                        </a>
                      ) : (
                        <button type="button" className={styles.boardItem} data-active={active ? "true" : "false"} aria-current={active ? "page" : undefined} onClick={() => onSelectBoard?.(b, cat)}>
                          <Icon name="file-list-line" color="gray-600" size={{ width: 16, height: 16 }} aria-hidden />
                          <span className={styles.boardName}>{b.name}</span>
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </nav>
    </aside>
  );
}
