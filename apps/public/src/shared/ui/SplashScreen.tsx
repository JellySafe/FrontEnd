"use client";

import { Logo } from "@jellysafe/design-system";
import { useEffect, useState } from "react";
import { PUBLIC_APP_MAX_WIDTH_CLASS } from "./public-layout";

/** 링크 신규 접속(풀 로드) 시 스플래시 유지 시간. 앱 내 soft navigation에서는 재노출되지 않음. */
const SPLASH_DURATION_MS = 1000;
/** 종료 디졸브(opacity) 시간 */
const SPLASH_DISSOLVE_MS = 400;

type SplashPhase = "visible" | "dissolving" | "hidden";

/**
 * Public 스플래시 (Figma UI/Public splash 590:9360).
 * 루트 layout에 마운트되어 문서 진입마다 잠깐 노출한 뒤 디졸브로 사라진다.
 */
export function SplashScreen() {
  const [phase, setPhase] = useState<SplashPhase>("visible");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("hidden");
      return;
    }

    const timerId = window.setTimeout(() => {
      setPhase("dissolving");
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timerId);
  }, []);

  if (phase === "hidden") {
    return null;
  }

  return (
    <div
      aria-busy={phase === "visible"}
      aria-label="JellySafe"
      className={[
        "fixed inset-0 z-50 flex items-center justify-center bg-bg-default",
        "transition-opacity ease-out",
        phase === "dissolving" ? "pointer-events-none opacity-0" : "opacity-100",
        PUBLIC_APP_MAX_WIDTH_CLASS,
      ].join(" ")}
      onTransitionEnd={(event) => {
        if (event.target !== event.currentTarget) return;
        if (phase === "dissolving") {
          setPhase("hidden");
        }
      }}
      role="status"
      style={{ transitionDuration: `${SPLASH_DISSOLVE_MS}ms` }}
    >
      <div className="flex w-[209px] -translate-y-4 flex-col items-center gap-(--gap-3)">
        <Logo variant="logotype" />
        <p className="w-full text-center text-body-large-mobile font-semibold text-text-brand">
          날씨처럼 예보하는 제주 해파리
        </p>
      </div>
    </div>
  );
}
