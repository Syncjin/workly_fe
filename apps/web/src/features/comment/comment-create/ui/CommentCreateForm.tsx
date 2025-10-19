"use client";
import { Button, Textarea } from "@workly/ui";
import * as styles from "./commentCreateForm.css";

export const CommentCreateForm = () => {
  const onCreateComment = async () => {};
  return (
    <div className={styles.textareaBox}>
      <Textarea name="comment" className={styles.textarea} placeholder="댓글을 입력하세요." />
      <Button size="sm" className={styles.createBtn} color="brand-600" onClick={onCreateComment} type="button">
        입력
      </Button>
    </div>
  );
};
