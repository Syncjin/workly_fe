"use client";

import { SelectBoard, useSelectBoardList } from "@/features/board/board-select/model/useSelectBoardList";
import { Radio } from "@workly/ui";
import { useMemo } from "react";
import * as styles from "./boardSelectDialog.css";

type BodyProps = {
  activeBoardId?: number;
  onChange: (board: SelectBoard) => void;
};

export const BoardSelectDialogContent = ({ activeBoardId, onChange }: BodyProps) => {
  const { data } = useSelectBoardList();

  const content = useMemo(() => {
    return data?.map(({ category, boards }) => (
      <section key={category.id} aria-labelledby={`category-${category.id}`}>
        <h3 id={`category-${category.id}`} className={styles.headerText}>
          {category.name}
        </h3>
        <ul>
          {boards.map((board) => {
            const active = board.id === activeBoardId;
            return (
              <li key={board.id}>
                <label className={styles.list} htmlFor={`board-${board.id}`} data-active={active ? "true" : undefined}>
                  <Radio id={`board-${board.id}`} name={category.name} size="sm" checked={active} onChange={() => onChange(board)} />
                  <span className={styles.boardText}>{board.name}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>
    ));
  }, [data, activeBoardId, onChange]);

  return (
    <div className={styles.content} role="radiogroup">
      {content}
    </div>
  );
};
