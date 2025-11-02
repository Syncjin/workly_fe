"use client";

import { Icon } from "@workly/ui";
import * as styles from "./trashList.css";

export const TrashEmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>
        <Icon name="file-list-line" size={48} color="var(--color-gray-400)" />
      </div>
      <h3 className={styles.emptyStateTitle}>휴지통이 비어있습니다</h3>
      <p className={styles.emptyStateDescription}>삭제된 게시글이 없습니다.</p>
    </div>
  );
};

TrashEmptyState.displayName = "TrashEmptyState";
