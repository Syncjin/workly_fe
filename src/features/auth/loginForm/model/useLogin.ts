// features/auth/loginForm/model/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/login";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("data", data);
      // router.push("/dashboard");
    },
    onError: (err) => {
      console.error("로그인 실패", err);
    },
  });
}
