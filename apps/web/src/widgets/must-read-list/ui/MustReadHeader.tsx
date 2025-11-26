"use client";

import * as styles from "./mustReadList.css";

export const MustReadHeader = () => {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>필독 게시글</h1>
      <p className={styles.headerDescription}>반드시 읽어야 할 중요한 게시글들을 확인하세요.</p>
    </div>
  );
};

MustReadHeader.displayName = "MustReadHeader";
