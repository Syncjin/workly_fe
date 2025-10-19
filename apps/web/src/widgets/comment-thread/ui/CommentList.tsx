"use client";

import { CommentListParams, useCommentList } from "@/entities/comment";
import * as styles from "./commentList.css";

export const CommentList = ({ postId }: { postId: number }) => {
  const params: CommentListParams = {
    postId,
  };
  const { data, isPending } = useCommentList(params);
  return <div className={styles.container}></div>;
};

CommentList.displayName = "CommentList";
