"use client";

import { Icon } from "@workly/ui";
import * as styles from "./trashList.css";

export const TrashEmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <Icon name="delete-bin-line" size={48} color="var(--color-gray-400)" />
      <h3>휴지통이 비어있습니다</h3>
      <p>삭제된 게시글이 없습니다.</p>
    </div>
  );
};

TrashEmptyState.displayName = "TrashEmptyState";
