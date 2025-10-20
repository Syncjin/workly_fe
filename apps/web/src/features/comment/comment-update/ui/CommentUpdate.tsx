"use client";
import { Comment, CommentEditor } from "@/entities/comment";
import { commentSchema, useCommentUpdateAction } from "@/features/comment/comment-update";
import { Button, Icon } from "@workly/ui";
import { ChangeEvent, KeyboardEvent, useCallback, useState } from "react";
import * as styles from "./commentUpdate.css";

export const CommentUpdate = ({ postId, comment, onCancel }: { postId: number; comment: Comment; onCancel?: () => void }) => {
  const [content, setContent] = useState(comment.content);
  const [error, setError] = useState<string | null>(null);

  const { run, isPending } = useCommentUpdateAction();

  const onUpdateComment = useCallback(async () => {
    const parsed = commentSchema.safeParse({ postId, content, commentId: comment.commentId });
    console.log("pars", parsed);
    if (!parsed.success) {
      const msg = parsed.error.issues.find((i) => i.path[0] === "content")?.message ?? parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.";
      setError(msg);
      return;
    }
    setError(null);

    await run(parsed.data);
    setContent("");
    onCancel?.();
  }, [postId, content, comment.commentId]);

  const btnOnCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  const contentOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.currentTarget.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onUpdateComment();
    }
  };

  return (
    <CommentEditor.Root value={content} onChange={contentOnChange} onKeyDown={handleKeyDown} isPending={isPending} error={error}>
      <CommentEditor.Editor />
      <CommentEditor.ActionSlot>
        <div className={styles.actionArea}>
          <Button size="sm" variant="border" color="gray-300" onClick={btnOnCancel} type="button">
            취소
          </Button>
          <Button size="sm" color="brand-600" onClick={onUpdateComment} type="button" loading={isPending} loadingIcon={<Icon name="loader-2-line" color="#fff" />}>
            입력
          </Button>
        </div>
      </CommentEditor.ActionSlot>
    </CommentEditor.Root>
  );
};
