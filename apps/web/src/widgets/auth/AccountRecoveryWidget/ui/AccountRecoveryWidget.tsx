"use client";

import { ForgotIdFormContent, useForgotIdAction } from "@/features/auth/forgot-id";
import { ForgotPasswordFormContent, useForgotPasswordAction } from "@/features/auth/forgot-password";
import { Icon } from "@workly/ui";
import Link from "next/link";
import { useState } from "react";
import { accountRecoveryCard, accountRecoveryContainer, link, linkContainer, logoContainer, tab, tabActive, tabContainer } from "./accountRecoveryWidget.css";

type TabType = "id" | "password";

export function AccountRecoveryWidget() {
  const [activeTab, setActiveTab] = useState<TabType>("id");
  const forgotIdAction = useForgotIdAction();
  const forgotPasswordAction = useForgotPasswordAction();

  return (
    <div className={accountRecoveryContainer}>
      <div className={accountRecoveryCard}>
        <div className={logoContainer}>
          <Icon name="logo-vertical" size={{ width: 128, height: 86 }} color="var(--color-brand-600)" />
        </div>

        <div className={tabContainer}>
          <button type="button" className={activeTab === "id" ? tabActive : tab} onClick={() => setActiveTab("id")}>
            아이디 찾기
          </button>
          <button type="button" className={activeTab === "password" ? tabActive : tab} onClick={() => setActiveTab("password")}>
            비밀번호 찾기
          </button>
        </div>

        {activeTab === "id" ? <ForgotIdFormContent action={forgotIdAction} /> : <ForgotPasswordFormContent action={forgotPasswordAction} />}

        <div className={linkContainer}>
          <Link href="/login" className={link}>
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
