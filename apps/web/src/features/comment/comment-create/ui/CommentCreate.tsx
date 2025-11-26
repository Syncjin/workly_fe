"use client";
import { CommentEditor } from "@/entities/comment";
import { commentSchema, useCommentCreateAction } from "@/features/comment/comment-create";
import { Button, Icon } from "@workly/ui";
import { ChangeEvent, KeyboardEvent, useCallback, useState } from "react";
import * as styles from "./commentCreate.css";

type CommentCreateProps = {
  postId: number;
  parentId?: number;
  onCancel?: () => void;
};

export const CommentCreate = ({ postId, parentId, onCancel }: CommentCreateProps) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { run, isPending } = useCommentCreateAction();

  const onCreateComment = useCallback(async () => {
    const parsed = commentSchema.safeParse({ postId, content, parentId });
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
  }, [postId, content, parentId, onCancel, run]);

  const contentOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.currentTarget.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onCreateComment();
    }
  };

  const isReplyMode = parentId !== undefined;

  return (
    <CommentEditor.Root value={content} onChange={contentOnChange} onKeyDown={handleKeyDown} isPending={isPending} error={error}>
      <CommentEditor.Editor />
      <CommentEditor.ActionSlot>
        <div className={styles.btnArea}>
          {isReplyMode && onCancel && (
            <Button size="sm" color="gray-200" onClick={onCancel} type="button" disabled={isPending}>
              취소
            </Button>
          )}
          <Button size="sm" color="brand-600" onClick={onCreateComment} type="button" loading={isPending} loadingIcon={<Icon name="loader-2-line" color="#fff" />}>
            입력
          </Button>
        </div>
      </CommentEditor.ActionSlot>
    </CommentEditor.Root>
  );
};
