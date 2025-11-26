import { z } from "zod";

export const forgotIdSchema = z.object({
  name: z.string().min(1, "이름을 입력해 주세요.").max(50, "이름은 최대 50자까지 입력 가능합니다."),
  email: z.string().min(1, "이메일을 입력해 주세요.").email("올바른 이메일 형식이 아닙니다."),
});

export type ForgotIdFormData = z.infer<typeof forgotIdSchema>;
