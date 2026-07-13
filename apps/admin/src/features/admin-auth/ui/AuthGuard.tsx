"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { isAdminAuthenticated } from "../model/admin-session";

function subscribe() {
  return () => {};
}

// sessionStorage 기반 임시 가드. 백엔드 인증 확정 시 서버 세션 검증으로 교체한다.
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAllowed = useSyncExternalStore(
    subscribe,
    () => isAdminAuthenticated(),
    () => false,
  );

  useEffect(() => {
    if (!isAllowed) {
      router.replace("/login");
    }
  }, [router, isAllowed]);

  if (!isAllowed) return null;

  return children;
}
