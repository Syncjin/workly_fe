"use client";

import { useLogin } from "@/entities/auth";
import { log } from "@/lib/logger";
import { setAccessToken, setCsrfToken } from "@/shared/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "./schema";

export function useLoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: "",
      password: "",
      autoLogin: false,
    },
  });
  const router = useRouter();
  const { mutateAsync } = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await mutateAsync({ userId: data.userId, password: data.password });
      log.debug("로그인 시도:response", response);

      if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
      }
      if (response.data?.csrfToken) {
        setCsrfToken(response.data.csrfToken);
      }

      if (response.status === 200) {
        router.push("/board");
      }
    } catch (error) {
      log.error("로그인 성공 후 토큰 저장 중 오류 발생", {
        error,
        operation: "login",
      });
    }
  };

  const handleFindIdpw = () => {
    console.log("아이디/비번 찾기");
  };

  return {
    ...form,
    onSubmit,
    handleFindIdpw,
  };
}
