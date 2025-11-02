"use client";

import { Icon } from "@workly/ui";
import * as styles from "./myPostsList.css";

/**
 * 내 게시글이 없을 때 표시되는 빈 상태 컴포넌트
 */
export const MyPostsEmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <Icon name="file-text-line" size={48} color="var(--color-gray-400)" />
      <h3 className={styles.emptyTitle}>작성한 게시글이 없습니다</h3>
      <p className={styles.emptyDescription}>
        아직 작성한 게시글이 없습니다.
        <br />
        새로운 게시글을 작성해보세요.
      </p>
    </div>
  );
};

MyPostsEmptyState.displayName = "MyPostsEmptyState";
