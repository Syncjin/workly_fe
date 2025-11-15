import { useForgotId, type AuthForgotIdRequest } from "@/entities/auth";
import { useCallback } from "react";

export function useForgotIdAction() {
  const { mutateAsync, isPending } = useForgotId();

  const run = useCallback(
    async (data: AuthForgotIdRequest) => {
      if (!data.name?.trim()) throw new Error("이름을 입력해주세요.");
      if (!data.email?.trim()) throw new Error("이메일을 입력해주세요.");

      return await mutateAsync(data);
    },
    [mutateAsync]
  );

  return { run, isPending };
}
