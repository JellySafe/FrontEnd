"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { signInAdmin } from "../api/signIn";

const CREDENTIAL_ERROR = "이메일, 비밀번호가 틀렸습니다.";

export function useAdminLogin() {
  const router = useRouter();
  const [email, setEmailValue] = useState("");
  const [password, setPasswordValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setEmail = (value: string) => {
    setEmailValue(value);
    if (error) setError(null);
  };
  const setPassword = (value: string) => {
    setPasswordValue(value);
    if (error) setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError(CREDENTIAL_ERROR);
      return;
    }

    setIsSubmitting(true);
    try {
      await signInAdmin({ email, password });
      router.replace("/dashboard");
    } catch {
      setError(CREDENTIAL_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  };
}
