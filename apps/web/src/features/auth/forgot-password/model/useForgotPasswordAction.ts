import { useForgotPassword, type AuthForgotPasswordRequest } from "@/entities/auth";
import { useCallback } from "react";

export function useForgotPasswordAction() {
  const { mutateAsync, isPending } = useForgotPassword();

  const run = useCallback(
    async (data: AuthForgotPasswordRequest) => {
      if (!data.userId?.trim()) throw new Error("아이디를 입력해주세요.");
      if (!data.name?.trim()) throw new Error("이름을 입력해주세요.");
      if (!data.email?.trim()) throw new Error("이메일을 입력해주세요.");

      return await mutateAsync(data);
    },
    [mutateAsync]
  );

  return { run, isPending };
}
