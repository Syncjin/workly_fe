"use client";

import { Icon } from "@workly/ui";
import * as styles from "./mustReadList.css";

export const MustReadEmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>
        <Icon name="file-list-line" size={48} />
      </div>
      <h3 className={styles.emptyStateTitle}>필독 게시글이 없습니다</h3>
      <p className={styles.emptyStateDescription}>현재 필독으로 지정된 게시글이 없습니다.</p>
    </div>
  );
};

MustReadEmptyState.displayName = "MustReadEmptyState";
