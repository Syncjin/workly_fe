"use client";
import { commentSchema, useCommentCreateAction } from "@/features/comment/comment-create";
import { Button, Textarea } from "@workly/ui";
import { ChangeEvent, useCallback, useState } from "react";
import * as styles from "./commentCreate.css";

export const CommentCreate = ({ postId }: { postId: number }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { run } = useCommentCreateAction();

  const onCreateComment = useCallback(async () => {
    const parsed = commentSchema.safeParse({ postId, content });
    console.log("pars", parsed);
    if (!parsed.success) {
      const msg = parsed.error.issues.find((i) => i.path[0] === "content")?.message ?? parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.";
      setError(msg);
      return;
    }
    setError(null);

    // 2) 전송 (여기선 예시로 콘솔, 실제로는 mutate(parsed.data))
    // mutate(parsed.data, { onSuccess: () => setContent("") });
    console.log("create comment payload:", parsed.data);
    run(parsed.data);
    setContent("");
  }, [postId, content]);

  const contentOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.currentTarget.value);
  };

  return (
    <div className={styles.textareaBox}>
      <Textarea name="comment" className={styles.textarea} placeholder="댓글을 입력하세요." value={content} onChange={contentOnChange} aria-invalid={!!error} aria-describedby={error ? "comment-error" : undefined} />
      <Button size="sm" className={styles.createBtn} color="brand-600" onClick={onCreateComment} type="button">
        입력
      </Button>
    </div>
  );
};
