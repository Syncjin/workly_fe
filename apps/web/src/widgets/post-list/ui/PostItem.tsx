"use client";

import { Post } from "@/entities/post";
import { formatDayOrTime } from "@/shared/lib/format/date/formatters";
import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";
import * as styles from "./postItem.css";

interface PostItemProps {
  post: Post;
}

export const PostItem = memo(({ post }: PostItemProps) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/article/${post.postId}`);
  }, [router, post.postId]);

  return (
    <div className={styles.postItem} onClick={handleClick}>
      <div className={styles.postInfo}>
        <div className={styles.postTitle}>{post.title}</div>
        <div className={styles.postMeta}>
          {post.board?.boardName && <span className={styles.boardBadge}>{post.board.boardName}</span>}
          <span>{formatDayOrTime(post.createdDateTime)}</span>
        </div>
      </div>
    </div>
  );
});

PostItem.displayName = "PostItem";
