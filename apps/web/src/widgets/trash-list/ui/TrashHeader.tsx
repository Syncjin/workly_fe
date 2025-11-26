"use client";

import * as styles from "./trashList.css";

export const TrashHeader = () => {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>휴지통</h1>
      <p className={styles.headerDescription}>삭제된 게시글들을 확인하고 복원하거나 영구 삭제할 수 있습니다.</p>
    </div>
  );
};

TrashHeader.displayName = "TrashHeader";
