import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Icon, InputField } from "@workly/ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ForgotPasswordFormData, forgotPasswordSchema } from "../model/schema";
import { errorMessage, form, submitButton, successMessage } from "./formContent.css";

interface ForgotPasswordFormContentProps {
  action: {
    run: (data: ForgotPasswordFormData) => Promise<any>;
    isPending: boolean;
  };
}

export function ForgotPasswordFormContent({ action }: ForgotPasswordFormContentProps) {
  const { run, isPending } = action;
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { userId: "", name: "", email: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    try {
      setError(null);
      setSuccess(false);

      const response = await run(values);

      if (response.status === 200) {
        setSuccess(true);
      } else {
        setError(response.message || "비밀번호 찾기에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (e: any) {
      const errorMsg = e?.message || "비밀번호 찾기에 실패했습니다. 다시 시도해주세요.";
      setError(errorMsg);
    }
  };

  const loading = isSubmitting || isPending;

  return (
    <>
      {success ? (
        <div className={successMessage}>입력하신 이메일로 비밀번호 재설정 링크를 발송했습니다. 이메일을 확인해주세요.</div>
      ) : (
        <form className={form} onSubmit={handleSubmit(onSubmit)} aria-busy={loading}>
          <InputField id="userId" type="text" placeholder="아이디를 입력해주세요" {...register("userId")} status={errors.userId ? "error" : "default"} errorText={errors.userId?.message} />

          <InputField id="name" type="text" placeholder="이름을 입력해주세요" {...register("name")} status={errors.name ? "error" : "default"} errorText={errors.name?.message} />

          <InputField id="email" type="email" placeholder="이메일을 입력해주세요" {...register("email")} status={errors.email ? "error" : "default"} errorText={errors.email?.message} />

          {error && <div className={errorMessage}>{error}</div>}

          <Button type="submit" className={submitButton} size="xl" variant="solid" color="brand-600" loading={loading} loadingIcon={<Icon name="loader-2-line" color="#fff" />}>
            비밀번호 찾기
          </Button>
        </form>
      )}
    </>
  );
}
