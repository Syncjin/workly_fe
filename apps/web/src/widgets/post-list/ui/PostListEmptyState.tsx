"use client";

import { Button } from "@workly/ui";
import React from "react";
import * as styles from "./postListEmptyState.css";

interface PostListEmptyStateProps {
  type: "no-unread-posts";
  onShowAll?: () => void;
}

export const PostListEmptyState = React.memo<PostListEmptyStateProps>(({ type, onShowAll }) => {
  if (type === "no-unread-posts") {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.icon}>📖</div>
          <h3 className={styles.title}>게시글을 모두 읽었습니다</h3>
          <p className={styles.description}>읽지 않은 게시글이 없습니다. 전체 게시글을 확인해보세요.</p>
          {onShowAll && (
            <Button size="md" onClick={onShowAll} className={styles.button}>
              전체 게시글 보기
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
});

PostListEmptyState.displayName = "PostListEmptyState";
