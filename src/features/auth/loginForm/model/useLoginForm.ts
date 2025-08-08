"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "./schema";
import { useLogin } from "./useLogin";

export function useLoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      autoLogin: false,
    },
  });

  const { mutateAsync, isPending, error } = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log(" process.env.NEXT_PUBLIC_API_URL???", process.env.NEXT_PUBLIC_API_URL);
      console.log("로그인 시도:", data);
      const response = await mutateAsync(data);
      console.log("로그인 시도:response", response);
    } catch (error) {
      console.error("로그인 실패:", error);
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
