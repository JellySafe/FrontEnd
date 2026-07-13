"use client";

import { useEffect, useRef } from "react";

const HIDE_DELAY_MS = 1000;

/** 스크롤 중에만 data-scrolling="true" → .scrollbar-indicator thumb 표시 */
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
