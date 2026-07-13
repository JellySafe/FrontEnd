"use client";

import type { ReactNode } from "react";
import { useScrollIndicator } from "@jellysafe/design-system";
import { PUBLIC_APP_MAX_WIDTH_CLASS } from "./public-layout";

export type PublicPageShellProps = {
  children: ReactNode;
  /** 하단 고정 영역(내비게이션, CTA 등) */
  footer?: ReactNode;
  /** footer 위 오버레이(말풍선 등). footer와 함께 고정 래퍼 안에 렌더 */
  footerOverlay?: ReactNode;
  className?: string;
  /** 본문 패딩. 기본: 좌우·상단 + 하단 고정 UI 여유 */
  contentClassName?: string;
  /** false면 본문 자체는 스크롤하지 않음(내부에서 스크롤 영역 분리할 때) */
  scrollable?: boolean;
  /** false면 스크롤바를 숨김(스크롤은 유지). 기본 true */
  showScrollbar?: boolean;
};

/**
 * Public 모바일 웹앱 페이지 셸.
 * 뷰포트 가로를 채우되 max-w-[430px]에서 컷 + 중앙 정렬.
 * 하단 footer도 동일 폭으로 맞춤.
 * 본문이 스크롤 컨테이너(h-dvh + overflow-y-auto)라 document 스크롤에 의존하지 않음.
 */
export function PublicPageShell({
  children,
  footer,
  footerOverlay,
  className,
  contentClassName,
  scrollable = true,
  showScrollbar = true,
}: PublicPageShellProps) {
  const hasFooter = footer != null || footerOverlay != null;
  const contentScrollRef = useScrollIndicator<HTMLDivElement>();

  return (
    <div
      className={[
        "relative flex h-dvh flex-col overflow-hidden bg-bg-default",
        PUBLIC_APP_MAX_WIDTH_CLASS,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "flex min-h-0 w-full flex-1 flex-col",
          scrollable
            ? [
                showScrollbar ? "scrollbar-indicator" : "scrollbar-none",
                "overflow-y-auto overscroll-y-contain",
              ].join(" ")
            : "overflow-hidden",
          hasFooter ? "pb-[calc(var(--padding-10)+var(--padding-8))]" : "",
          contentClassName ?? "px-(--padding-5) pt-(--padding-8)",
        ]
          .filter(Boolean)
          .join(" ")}
        ref={scrollable && showScrollbar ? contentScrollRef : undefined}
      >
        {children}
      </div>

      {hasFooter ? (
        <div
          className={[
            "fixed bottom-0 left-1/2 z-30 w-full -translate-x-1/2",
            "max-w-[430px]",
          ].join(" ")}
        >
          {/* nav 먼저, overlay를 위에 올려 말풍선 꼬리가 네비에 가리지 않게 함 */}
          {footer}
          {footerOverlay ? (
            <div className="pointer-events-none absolute inset-x-0 top-[-5px] z-10">
              {footerOverlay}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
