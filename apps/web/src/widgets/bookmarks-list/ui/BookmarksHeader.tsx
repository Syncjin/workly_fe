"use client";

import * as styles from "./bookmarksList.css";

export const BookmarksHeader = () => {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>중요 목록</h1>
      <p className={styles.headerDescription}>중요 표시한 게시글들을 확인하고 관리하세요.</p>
    </div>
  );
};

BookmarksHeader.displayName = "BookmarksHeader";
