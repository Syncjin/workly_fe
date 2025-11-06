"use client";

import { Icon, Tooltip } from "@workly/ui";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import * as styles from "./collapsibleBoardTree.css";

interface TrashBinProps {
  isCollapsed?: boolean;
  onClick?: () => void;
}

export const TrashBin = ({ isCollapsed, onClick }: TrashBinProps) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    try {
      if (onClick) {
        onClick();
      } else {
        router.push("/trash");
      }
    } catch (error) {
      console.error("휴지통 네비게이션 중 오류가 발생했습니다:", error);
    }
  }, [onClick, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  if (isCollapsed) {
    return (
      <Tooltip content="휴지통" position="right">
        <button
          type="button"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={styles.boardButton({ active: false })}
          aria-label="휴지통으로 이동"
          role="button"
          tabIndex={0}
          style={{
            width: "36px",
            height: "36px",
            padding: "10px",
            justifyContent: "center",
          }}
        >
          <Icon name="delete-bin-line" color="gray-600" size={{ width: 16, height: 16 }} />
        </button>
      </Tooltip>
    );
  }

  return (
    <button type="button" onClick={handleClick} onKeyDown={handleKeyDown} className={styles.boardButton({ active: false })} aria-label="휴지통으로 이동" role="button" tabIndex={0}>
      <Icon name="delete-bin-line" color="gray-600" size={{ width: 16, height: 16 }} />
      <span className={styles.boardText}>휴지통</span>
    </button>
  );
};

export default TrashBin;
