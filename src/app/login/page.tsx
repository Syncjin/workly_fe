"use client";

import { Button } from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import InputField from "@/shared/ui/Input/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CheckBoxField from "../../shared/ui/CheckBox/CheckBoxField";
import { checkboxContainer, forgotPasswordLink, form, loginButton, loginCard, loginContainer, logoContainer } from "./login.css";

// 폼 검증 스키마 정의
const loginSchema = z.object({
  id: z.email({ message: "올바른 ID 형식이 아닙니다" }).min(1, "ID를 입력해 주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요").min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
  autoLogin: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      id: "",
      password: "",
      autoLogin: false,
    },
  });

  const autoLogin = watch("autoLogin");

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("로그인 시도:", data);
      // 실제 로그인 API 호출
      // const response = await loginAPI(data);
      // if (response.success) {
      //   // 로그인 성공 처리
      // }
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  const handleFindId = () => {
    console.log("아이디 찾기");
  };

  const handleFindPassword = () => {
    console.log("비밀번호 찾기");
  };

  return (
    <div className={loginContainer}>
      <div className={loginCard}>
        <div className={logoContainer}>
          <Icon name="logo-vertical" size={{ width: 128, height: 86 }} color="var(--color-brand-600)" />
        </div>

        <form className={form} onSubmit={handleSubmit(onSubmit)}>
          <InputField id="id" type="text" placeholder="ID를 입력해주세요" {...register("id")} status={errors.id ? "error" : "default"} errorText={errors.id?.message} />

          <InputField id="password" type="password" placeholder="비밀번호를 입력해주세요" {...register("password")} status={errors.password ? "error" : "default"} errorText={errors.password?.message} />

          <div className={checkboxContainer}>
            <CheckBoxField label="자동 로그인" id="autoLogin" checked={autoLogin} onChange={(e) => setValue("autoLogin", e.target.checked)} />

            <Button type="button" variant="link" color="gray-700" className={forgotPasswordLink} onClick={handleFindId}>
              아이디/비밀번호 찾기
            </Button>
          </div>

          <Button type="submit" className={loginButton} size="xl" variant="solid" color="brand-600" disabled={isSubmitting}>
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </div>
    </div>
  );
}
