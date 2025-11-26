"use client";

import { Icon } from "@workly/ui";
import * as styles from "./bookmarksList.css";

export const BookmarksEmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>
        <Icon name="file-list-line" size={48} />
      </div>
      <h3 className={styles.emptyStateTitle}>중요 표시한 게시글이 없습니다</h3>
      <p className={styles.emptyStateDescription}>관심 있는 게시글을 중요 표시하여 나중에 다시 확인해보세요.</p>
    </div>
  );
};

BookmarksEmptyState.displayName = "BookmarksEmptyState";
