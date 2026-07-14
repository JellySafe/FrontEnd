"use client";

import { Button, TextField } from "@jellysafe/design-system";
import { useAdminLogin } from "../model/useAdminLogin";

export function LoginForm() {
  const {
    email,
    password,
    setEmail,
    setPassword,
    error,
    isSubmitting,
    handleSubmit,
  } = useAdminLogin();
  const state = error ? "error" : "default";

  return (
    <form
      className="flex w-full flex-col gap-(--gap-8)"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="flex w-full flex-col gap-(--gap-3)">
        <TextField
          autoComplete="email"
          label="이메일"
          onChange={(event) => setEmail(event.target.value)}
          onClear={email ? () => setEmail("") : undefined}
          placeholder="이메일을 입력하세요"
          state={state}
          type="email"
          value={email}
        />
        <TextField
          autoComplete="current-password"
          error={error ?? undefined}
          label="비밀번호"
          onChange={(event) => setPassword(event.target.value)}
          onClear={password ? () => setPassword("") : undefined}
          placeholder="비밀번호를 입력하세요"
          state={state}
          type="password"
          value={password}
        />
      </div>
      <Button className="w-full" disabled={isSubmitting} platform="pc" type="submit">
        로그인
      </Button>
    </form>
  );
}
