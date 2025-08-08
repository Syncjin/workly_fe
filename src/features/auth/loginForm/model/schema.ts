import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "ID를 입력해 주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요").min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
  autoLogin: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
