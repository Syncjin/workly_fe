import { useResetPassword, type AuthResetPasswordRequest } from "@/entities/auth";
import { useCallback } from "react";

export function useResetPasswordAction() {
  const { mutateAsync, isPending } = useResetPassword();

  const run = useCallback(
    async (data: AuthResetPasswordRequest) => {
      if (!data.token?.trim()) throw new Error("유효하지 않은 토큰입니다.");
      if (!data.newPassword?.trim()) throw new Error("새 비밀번호를 입력해주세요.");

      return await mutateAsync(data);
    },
    [mutateAsync]
  );

  return { run, isPending };
}
