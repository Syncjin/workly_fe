import { z } from "zod";

export const forgotPasswordSchema = z.object({
  userId: z.string().min(1, "아이디를 입력해 주세요.").max(50, "아이디는 최대 50자까지 입력 가능합니다."),
  name: z.string().min(1, "이름을 입력해 주세요.").max(50, "이름은 최대 50자까지 입력 가능합니다."),
  email: z.string().min(1, "이메일을 입력해 주세요.").email("올바른 이메일 형식이 아닙니다."),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
