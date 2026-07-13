"use client";

import { useEffect, useRef } from "react";

const HIDE_DELAY_MS = 1000;

// 스크롤 중에만 data-scrolling="true"를 부여해 .scrollbar-indicator 스크롤바를 표시한다.
// 스크롤이 멈추면 1초 뒤 속성을 제거해 스크롤바를 숨긴다.
export function useScrollIndicator<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let hideTimer: number | undefined;

    const handleScroll = () => {
      element.dataset.scrolling = "true";
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        delete element.dataset.scrolling;
      }, HIDE_DELAY_MS);
    };

    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      element.removeEventListener("scroll", handleScroll);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return ref;
}
