import { z } from "zod";

// 비밀번호 강도 검증: 8자 이상, 영문+숫자+특수문자 조합
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(1, "새 비밀번호를 입력해 주세요.").min(8, "비밀번호는 최소 8자 이상이어야 합니다.").max(100, "비밀번호는 최대 100자까지 입력 가능합니다.").regex(passwordRegex, "비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다."),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해 주세요."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
