"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { signInAdmin } from "../api/signIn";

const CREDENTIAL_ERROR = "아이디, 비밀번호가 틀렸습니다.";

export function useAdminLogin() {
  const router = useRouter();
  const [username, setUsernameValue] = useState("");
  const [password, setPasswordValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setUsername = (value: string) => {
    setUsernameValue(value);
    if (error) setError(null);
  };
  const setPassword = (value: string) => {
    setPasswordValue(value);
    if (error) setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 클라이언트 최소 검증: 빈 값 확인
    if (!username.trim() || !password.trim()) {
      setError(CREDENTIAL_ERROR);
      return;
    }

    setIsSubmitting(true);
    try {
      // 인증 연동 지점: 백엔드 명세 확정 시 실제 로그인/세션을 연결한다.
      await signInAdmin({ username, password });
      router.replace("/dashboard");
    } catch {
      setError(CREDENTIAL_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    username,
    password,
    setUsername,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  };
}
