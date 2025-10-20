"use client";

import { useCommentThreadState } from "@/widgets/comment-thread";
import { Button, Icon } from "@workly/ui";
import { useCallback } from "react";
import * as styles from "./commentActionHeader.css";

export const CommentActionHeader = () => {
  const reactionOnClick = useCallback(() => {}, []);
  const replyOnClick = useCallback(() => {}, []);
  const { commentCnt } = useCommentThreadState();
  return (
    <div className={styles.container}>
      <div className={styles.reactionBox}>
        <Button variant="ghost" color="gray-700" onClick={reactionOnClick} size="sm" className={styles.reactionItem}>
          <Icon name="emotion-happy-line" color="var(--color-gray-700)" /> 리액션
        </Button>
        <Button variant="ghost" color="gray-700" onClick={replyOnClick} size="sm" className={styles.reactionItem}>
          <Icon name="message-2-line" color="var(--color-gray-700)" /> {commentCnt ? commentCnt : "댓글"}
        </Button>
      </div>
    </div>
  );
};

CommentActionHeader.displayName = "CommentActionHeader";
