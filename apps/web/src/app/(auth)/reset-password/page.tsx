"use client";

import { ResetPasswordForm } from "@/features/auth/reset-password";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  // 토큰이 없는 경우 에러 메시지 표시
  if (!token) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "24px" }}>
        <div style={{ maxWidth: "400px", textAlign: "center" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "16px", color: "var(--color-gray-900)" }}>유효하지 않은 링크</h1>
          <p style={{ fontSize: "14px", color: "var(--color-gray-700)", marginBottom: "24px" }}>
            비밀번호 재설정 링크가 유효하지 않습니다.
            <br />
            비밀번호 찾기를 다시 진행해주세요.
          </p>
          <Link
            href="/account-recovery"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "var(--color-brand-600)",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            비밀번호 찾기
          </Link>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
