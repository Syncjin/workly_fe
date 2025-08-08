"use client";

import { Button } from "@/shared/ui/Button";
import CheckBoxField from "@/shared/ui/CheckBox/CheckBoxField";
import Icon from "@/shared/ui/Icon";
import InputField from "@/shared/ui/Input/InputField";
import { useLoginForm } from "../model/useLoginForm";
import { checkboxContainer, forgotPasswordLink, form, loginButton, loginCard, loginContainer, logoContainer } from "./loginForm.css";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    onSubmit,
    handleFindIdpw,
  } = useLoginForm();

  const autoLogin = watch("autoLogin");

  return (
    <div className={loginContainer}>
      <div className={loginCard}>
        <div className={logoContainer}>
          <Icon name="logo-vertical" size={{ width: 128, height: 86 }} color="var(--color-brand-600)" />
        </div>

        <form className={form} onSubmit={handleSubmit(onSubmit)}>
          <InputField id="username" type="text" placeholder="ID를 입력해주세요" {...register("username")} status={errors.username ? "error" : "default"} errorText={errors.username?.message} />

          <InputField id="password" type="password" placeholder="비밀번호를 입력해주세요" {...register("password")} status={errors.password ? "error" : "default"} errorText={errors.password?.message} />

          <div className={checkboxContainer}>
            <CheckBoxField label="자동 로그인" id="autoLogin" checked={autoLogin} onChange={(e) => setValue("autoLogin", e.target.checked)} />

            <Button type="button" variant="link" color="gray-700" className={forgotPasswordLink} onClick={handleFindIdpw}>
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
