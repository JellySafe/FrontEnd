"use client";

import { Button, TextField } from "@jellysafe/design-system";
import { useAdminLogin } from "../model/useAdminLogin";

export function LoginForm() {
  const {
    username,
    password,
    setUsername,
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
          autoComplete="username"
          label="아이디"
          onChange={(event) => setUsername(event.target.value)}
          onClear={username ? () => setUsername("") : undefined}
          placeholder="아이디를 입력하세요"
          state={state}
          value={username}
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
