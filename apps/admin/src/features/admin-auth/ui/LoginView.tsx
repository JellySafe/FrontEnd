"use client";

import { Logo } from "@jellysafe/design-system";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { isAdminAuthenticated } from "../model/admin-session";
import { LoginForm } from "./LoginForm";

function subscribe() {
  return () => {};
}

// 좌측: Jeju 히어로(장식 이미지, alt=""), 우측: 로그인 폼. 데스크톱 2분할 고정.
export function LoginView() {
  const router = useRouter();
  const isReady = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const isAuthenticated = useSyncExternalStore(
    subscribe,
    () => isAdminAuthenticated(),
    () => false,
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [router, isAuthenticated]);

  if (!isReady || isAuthenticated) return null;

  return (
    <div className="grid min-h-screen grid-cols-2">
      <div className="relative overflow-hidden bg-bg-surface">
        <Image
          alt=""
          className="object-cover"
          fill
          priority
          sizes="50vw"
          src="/assets/login-hero.jpg"
        />
      </div>
      <div className="flex items-center justify-center px-(--padding-10) py-(--padding-10)">
        <div className="flex w-full max-w-[390px] flex-col gap-(--gap-7)">
          <div className="flex flex-col gap-(--gap-3)">
            <Logo variant="symbol" />
            <h1 className="text-heading-medium-pc text-text-primary">
              안녕하세요, 젤리세이프입니다.
              <br />
              로그인하여 서비스를 이용해주세요.
            </h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
