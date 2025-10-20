"use client";
import { commentSchema, useCommentCreateAction } from "@/features/comment/comment-create";
import { Button, Icon, Textarea } from "@workly/ui";
import { ChangeEvent, KeyboardEvent, useCallback, useState } from "react";
import * as styles from "./commentCreate.css";

export const CommentCreate = ({ postId }: { postId: number }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { run, isPending } = useCommentCreateAction();

  const onCreateComment = useCallback(async () => {
    const parsed = commentSchema.safeParse({ postId, content });
    console.log("pars", parsed);
    if (!parsed.success) {
      const msg = parsed.error.issues.find((i) => i.path[0] === "content")?.message ?? parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.";
      setError(msg);
      return;
    }
    setError(null);

    await run(parsed.data);
    setContent("");
  }, [postId, content]);

  const contentOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.currentTarget.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift + Enter는 줄바꿈을 허용
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Enter 키의 기본 동작(줄바꿈)을 막음
      onCreateComment();
    }
  };

  return (
    <div className={styles.textareaBox}>
      <Textarea name="comment" className={styles.textarea} placeholder="댓글을 입력하세요." value={content} onChange={contentOnChange} onKeyDown={handleKeyDown} disabled={isPending} aria-invalid={!!error} aria-describedby={error ? "comment-error" : undefined} />
      <Button size="sm" className={styles.createBtn} color="brand-600" onClick={onCreateComment} type="button" loading={isPending} loadingIcon={<Icon name="loader-2-line" color="#fff" />}>
        입력
      </Button>
    </div>
  );
};
