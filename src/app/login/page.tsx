"use client";

import { Button } from "@/shared/ui/Button";
import CheckBox from "@/shared/ui/CheckBox";
import Icon from "@/shared/ui/Icon";
import { Input } from "@/shared/ui/Input";
import React, { useState } from "react";
import { checkboxContainer, checkboxLabel, forgotPasswordContainer, forgotPasswordLink, form, inputGroup, label, loginButton, loginCard, loginContainer, logoContainer, logoIcon, title } from "./login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직 구현
    console.log("로그인 시도:", { email, password, autoLogin });
  };

  const handleFindId = () => {
    // 아이디 찾기 로직
    console.log("아이디 찾기");
  };

  const handleFindPassword = () => {
    // 비밀번호 찾기 로직
    console.log("비밀번호 찾기");
  };

  return (
    <div className={loginContainer}>
      <div className={loginCard}>
        <div className={logoContainer}>
          <Icon name="apps-line" className={logoIcon} />
        </div>

        <h1 className={title}>로그인</h1>

        <form className={form} onSubmit={handleLogin}>
          <div className={inputGroup}>
            <label className={label} htmlFor="email">
              이메일
            </label>
            <Input id="email" type="email" placeholder="이메일을 입력해주세요" value={email} onChange={(e) => setEmail(e.target.value)} iconLeft={<Icon name="user-line" size={20} color="var(--color-gray-400)" />} required />
          </div>

          <div className={inputGroup}>
            <label className={label} htmlFor="password">
              비밀번호
            </label>
            <Input id="password" type="password" placeholder="비밀번호를 입력해주세요" value={password} onChange={(e) => setPassword(e.target.value)} iconLeft={<Icon name="lock-line" size={20} color="var(--color-gray-400)" />} required />
          </div>

          <div className={checkboxContainer}>
            <CheckBox id="autoLogin" checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)} />
            <label className={checkboxLabel} htmlFor="autoLogin">
              자동 로그인
            </label>
          </div>

          <div className={forgotPasswordContainer}>
            <button type="button" className={forgotPasswordLink} onClick={handleFindId}>
              아이디 찾기
            </button>
            <button type="button" className={forgotPasswordLink} onClick={handleFindPassword}>
              비밀번호 찾기
            </button>
          </div>

          <Button type="submit" className={loginButton} size="lg" variant="solid" color="brand-600">
            로그인
          </Button>
        </form>
      </div>
    </div>
  );
}

