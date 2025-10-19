"use client";

import { CommentItem, CommentListParams, useCommentList } from "@/entities/comment";
import * as styles from "./commentList.css";

export const CommentList = ({ postId }: { postId: number }) => {
  const params: CommentListParams = {
    postId,
  };
  const { data, isPending } = useCommentList(params, { select: (resp) => resp.data });
  if (data?.items?.length === 0) {
    return null;
  }
  return (
    <ul className={styles.container}>
      {data?.items?.map((comment) => (
        <CommentItem.Root key={comment.commentId} comment={comment} />
      ))}
    </ul>
  );
};

CommentList.displayName = "CommentList";
