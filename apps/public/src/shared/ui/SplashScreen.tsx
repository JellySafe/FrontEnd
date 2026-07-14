"use client";

import { Logo } from "@jellysafe/design-system";
import { useEffect, useState } from "react";
import { PUBLIC_APP_MAX_WIDTH_CLASS } from "./public-layout";

/** 루트(`/`) 첫 진입 시 스플래시 유지 시간 */
const SPLASH_DURATION_MS = 1000;
/** 종료 디졸브(opacity) 시간 */
const SPLASH_DISSOLVE_MS = 400;
/** 탭/앱 세션 동안 스플래시 1회만 (종료 시 초기화) */
export const SPLASH_SESSION_KEY = "jellysafe:splash-shown";
const SPLASH_ELEMENT_ID = "jellysafe-splash";

const SPLASH_BOOT_SCRIPT = `(function(){var n=document.getElementById(${JSON.stringify(
  SPLASH_ELEMENT_ID,
)});if(!n)return;var s=false;try{s=location.pathname==="/"&&sessionStorage.getItem(${JSON.stringify(
  SPLASH_SESSION_KEY,
)})!=="1"&&!matchMedia("(prefers-reduced-motion: reduce)").matches;sessionStorage.setItem(${JSON.stringify(
  SPLASH_SESSION_KEY,
)},"1")}catch(e){s=location.pathname==="/"}n.dataset.splashBoot=s?"show":"skip";n.hidden=!s})()`;

type SplashPhase = "off" | "on" | "out";

function shouldShowSplash(): boolean {
  if (typeof window === "undefined") return false;
  if (window.location.pathname !== "/") return false;
  try {
    if (sessionStorage.getItem(SPLASH_SESSION_KEY) === "1") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
      return false;
    }
  } catch {
    return true;
  }
  return true;
}

function getInitialSplashPhase(): SplashPhase {
  if (typeof window === "undefined") return "on";

  const bootDecision = document.getElementById(SPLASH_ELEMENT_ID)?.dataset.splashBoot;
  const isVisible = bootDecision ? bootDecision === "show" : shouldShowSplash();

  try {
    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
  } catch {
    // 저장소를 사용할 수 없어도 현재 진입의 스플래시는 정상 종료한다.
  }

  return isVisible ? "on" : "off";
}

/**
 * Public 스플래시 (Figma UI/Public splash 590:9360).
 * `/` 세션 첫 진입에만 노출. 인라인 스크립트가 첫 페인트 전에 노출 여부를 결정한다.
 */
export function SplashScreen() {
  // 서버 HTML부터 덮개를 렌더링해야 홈 화면이 먼저 비치지 않는다.
  const [phase, setPhase] = useState<SplashPhase>(getInitialSplashPhase);

  useEffect(() => {
    if (phase !== "on") return;
    const timerId = window.setTimeout(() => setPhase("out"), SPLASH_DURATION_MS);
    return () => window.clearTimeout(timerId);
  }, [phase]);

  // 디졸브 후 숨김. transitionend 미발화 대비 타임아웃 폴백.
  useEffect(() => {
    if (phase !== "out") return;
    const timerId = window.setTimeout(() => setPhase("off"), SPLASH_DISSOLVE_MS + 50);
    return () => window.clearTimeout(timerId);
  }, [phase]);

  return (
    <>
      <div
        aria-busy={phase === "on"}
        aria-label="JellySafe"
        className={[
          "fixed inset-0 z-50 flex items-center justify-center bg-bg-default",
          "transition-opacity ease-out",
          phase === "out" ? "pointer-events-none opacity-0" : "opacity-100",
          PUBLIC_APP_MAX_WIDTH_CLASS,
        ].join(" ")}
        hidden={phase === "off"}
        id={SPLASH_ELEMENT_ID}
        onTransitionEnd={(event) => {
          if (event.target !== event.currentTarget) return;
          if (phase === "out") setPhase("off");
        }}
        role="status"
        style={{ transitionDuration: `${SPLASH_DISSOLVE_MS}ms` }}
        suppressHydrationWarning
      >
        <div className="flex w-[209px] -translate-y-4 flex-col items-center gap-(--gap-3)">
          <Logo variant="logotype" />
          <p className="w-full text-center text-body-large-mobile font-semibold text-text-brand">
            날씨처럼 예보하는 제주 해파리
          </p>
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{ __html: SPLASH_BOOT_SCRIPT }}
        suppressHydrationWarning
        type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      />
    </>
  );
}
