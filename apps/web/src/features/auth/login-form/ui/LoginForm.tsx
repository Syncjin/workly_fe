"use client";

import { LoginFormData, loginSchema, useLoginAction } from "@/features/auth/login-form";
import { setAccessToken, setAutoLoginFlag } from "@/shared/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CheckBoxField, Icon, InputField } from "@workly/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { checkboxContainer, errorMessage, forgotPasswordLink, form, loginButton, loginCard, loginContainer, logoContainer } from "./loginForm.css";

export function LoginForm() {
  const { run, isPending: isPendingLogin } = useLoginAction();
  const [error, setErrorState] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userId: "", password: "", autoLogin: false },
    mode: "onSubmit",
  });
  const router = useRouter();
  const autoLogin = watch("autoLogin");
  const [isPendingRoute, startTransition] = useTransition();

  const onSubmit = async (values: LoginFormData) => {
    try {
      setErrorState(null);
      const response = await run(values);

      if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
        setAutoLoginFlag(values.autoLogin ?? false);
      }

      if (response.status === 200) {
        startTransition(() => {
          router.push("/board");
        });
      } else {
        setErrorState(response.message || "로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (e: any) {
      const errorMsg = e?.message || "로그인에 실패했습니다. 다시 시도해주세요.";
      setErrorState(errorMsg);
    }
  };

  const handleFindIdpw = () => {
    router.push("/account-recovery");
  };
  const loading = isSubmitting || isPendingLogin || isPendingRoute;

  return (
    <div className={loginContainer}>
      <div className={loginCard}>
        <div className={logoContainer}>
          <Icon name="logo-vertical" size={{ width: 128, height: 86 }} color="var(--color-brand-600)" />
        </div>

        <form className={form} onSubmit={handleSubmit(onSubmit)} aria-busy={loading}>
          <InputField id="userId" type="text" placeholder="ID를 입력해주세요" {...register("userId")} status={errors.userId ? "error" : "default"} errorText={errors.userId?.message} />

          <InputField id="password" type="password" placeholder="비밀번호를 입력해주세요" {...register("password")} status={errors.password ? "error" : "default"} errorText={errors.password?.message} />

          <div className={checkboxContainer}>
            <CheckBoxField label="자동 로그인" id="autoLogin" checked={autoLogin} onChange={(e) => setValue("autoLogin", e.target.checked)} />

            <Button type="button" variant="link" color="gray-700" className={forgotPasswordLink} onClick={handleFindIdpw}>
              아이디/비밀번호 찾기
            </Button>
          </div>

          {error && <div className={errorMessage}>{error}</div>}

          <Button type="submit" className={loginButton} size="xl" variant="solid" color="brand-600" loading={loading} loadingIcon={<Icon name="loader-2-line" color="#fff" />}>
            로그인
          </Button>
        </form>
      </div>
    </div>
  );
}
