"use client";

import { usePostLikeAction } from "@/features/post/post-like";
import { useCommentThreadState } from "@/widgets/comment-thread";
import { usePostDetail } from "@/widgets/post-detail";
import { Button, Icon } from "@workly/ui";
import { useCallback } from "react";
import * as styles from "./commentActionHeader.css";

export const CommentActionHeader = ({ postId }: { postId: number }) => {
  const { commentCnt } = useCommentThreadState();
  const { data } = usePostDetail({ postId });
  const { run } = usePostLikeAction();

  const reactionOnClick = useCallback(() => {
    run(postId);
  }, [postId, run]);

  const replyOnClick = useCallback(() => {}, []);

  return (
    <div className={styles.container}>
      <div className={styles.reactionBox}>
        <Button variant="ghost" color="gray-700" onClick={reactionOnClick} size="sm" className={styles.reactionItem}>
          <span className={styles.likeWrap} data-liked={data?.isLiked ? "true" : "false"}>
            <Icon name="thumb-up-line" className={styles.likeIcon} color={data.isLiked ? "var(--color-brand-500)" : "var(--color-gray-500)"} />
          </span>
        </Button>
        <Button variant="ghost" color="gray-700" onClick={replyOnClick} size="sm" className={styles.reactionItem}>
          <Icon name="message-2-line" color="var(--color-gray-700)" /> {commentCnt ? commentCnt : "댓글"}
        </Button>
      </div>
    </div>
  );
};

CommentActionHeader.displayName = "CommentActionHeader";
