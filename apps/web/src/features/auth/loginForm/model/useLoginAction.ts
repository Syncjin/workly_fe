import { useLogin, UserLoginRequest } from "@/entities/auth";
import { usersQueryKeys } from "@/entities/users";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function useLoginAction() {
  const qc = useQueryClient();
  const { mutateAsync, isPending } = useLogin();

  const run = useCallback(
    async ({ userId, password, autoLogin }: UserLoginRequest) => {
      if (!userId?.trim()) throw new Error("아이디를 입력해주세요.");
      if (!password?.trim()) throw new Error("비밀번호를 입력해주세요.");

      const result = await mutateAsync({ userId, password, autoLogin });

      await qc.invalidateQueries({ queryKey: usersQueryKeys.myInfo() });

      return result;
    },
    [mutateAsync, qc]
  );

  return { run, isPending };
}
