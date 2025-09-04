"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "./schema";
import { useLogin } from "./useLogin";

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
      console.log("로그인 시도:response", response);
      if (response.status === 200) {
        router.push("/posts");
      }
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
