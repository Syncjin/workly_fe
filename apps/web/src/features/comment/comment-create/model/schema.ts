import { z } from "zod";

export const commentSchema = z.object({
  postId: z.number().int().positive(),
  content: z.string().trim().min(1, "내용을 입력하세요").max(1_000, "최대 1,000자"),
});

export type CommentCreateValid = z.infer<typeof commentSchema>;
