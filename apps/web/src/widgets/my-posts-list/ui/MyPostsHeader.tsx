"use client";

import * as styles from "./myPostsList.css";

/**
 * 내 게시글 페이지의 헤더 컴포넌트
 *
 * 페이지 제목과 설명을 표시합니다.
 */
export const MyPostsHeader = () => {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>내 게시글</h1>
      <p className={styles.headerDescription}>내가 작성한 게시글을 확인하고 관리할 수 있습니다.</p>
    </div>
  );
};

MyPostsHeader.displayName = "MyPostsHeader";
