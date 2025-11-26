"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Icon, InputField } from "@workly/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ResetPasswordFormData, resetPasswordSchema } from "../model/schema";
import { useResetPasswordAction } from "../model/useResetPasswordAction";
import { errorMessage, form, link, linkContainer, logoContainer, passwordRequirements, passwordRequirementsItem, passwordRequirementsList, resetPasswordCard, resetPasswordContainer, submitButton, successMessage, title } from "./resetPasswordForm.css";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const { run, isPending } = useResetPasswordAction();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    try {
      setError(null);
      setSuccess(false);

      const response = await run({
        token,
        newPassword: values.newPassword,
      });

      if (response.status === 200) {
        setSuccess(true);
      } else {
        setError(response.message || "비밀번호 재설정에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "비밀번호 재설정에 실패했습니다. 다시 시도해주세요.";
      setError(errorMsg);
    }
  };

  // 성공 시 3초 후 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const loading = isSubmitting || isPending;

  return (
    <div className={resetPasswordContainer}>
      <div className={resetPasswordCard}>
        <div className={logoContainer}>
          <Icon name="logo-vertical" size={{ width: 128, height: 86 }} color="var(--color-brand-600)" />
        </div>

        <h1 className={title}>비밀번호 재설정</h1>

        {success ? (
          <div className={successMessage}>비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요. (3초 후 자동으로 이동합니다)</div>
        ) : (
          <>
            <div className={passwordRequirements}>
              <strong>비밀번호 요구사항:</strong>
              <ul className={passwordRequirementsList}>
                <li className={passwordRequirementsItem}>8자 이상</li>
                <li className={passwordRequirementsItem}>영문, 숫자, 특수문자 조합</li>
              </ul>
            </div>

            <form className={form} onSubmit={handleSubmit(onSubmit)} aria-busy={loading}>
              <InputField id="newPassword" type="password" placeholder="새 비밀번호를 입력해주세요" {...register("newPassword")} status={errors.newPassword ? "error" : "default"} errorText={errors.newPassword?.message} />

              <InputField id="confirmPassword" type="password" placeholder="비밀번호를 다시 입력해주세요" {...register("confirmPassword")} status={errors.confirmPassword ? "error" : "default"} errorText={errors.confirmPassword?.message} />

              {error && <div className={errorMessage}>{error}</div>}

              <Button type="submit" className={submitButton} size="xl" variant="solid" color="brand-600" loading={loading} loadingIcon={<Icon name="loader-2-line" color="#fff" />}>
                비밀번호 변경
              </Button>
            </form>
          </>
        )}

        <div className={linkContainer}>
          <Link href="/account-recovery" className={link}>
            비밀번호 찾기
          </Link>
          <span>|</span>
          <Link href="/login" className={link}>
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
