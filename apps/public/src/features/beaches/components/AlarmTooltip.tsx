import type { ReactNode } from "react";

type AlarmTooltipProps = {
  children: ReactNode;
  className?: string;
};

// Figma tooltip/mobile/dark: gray-10 둥근 박스 + 하단 중앙 삼각형(말풍선)
export function AlarmTooltip({ children, className }: AlarmTooltipProps) {
  return (
    <div
      className={[
        "pointer-events-none relative rounded-lg bg-[var(--color-gray-10)] px-(--padding-3) py-(--padding-2) text-center text-caption-medium-mobile whitespace-pre-line text-text-tertiary drop-shadow-[0_0_4px_var(--color-alpha-black-5)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="note"
    >
      {children}
      {/* Figma Polygon 1 — 박스 바로 아래, 아래로 뾰족한 꼬리 */}
      <svg
        aria-hidden
        className="absolute top-full left-1/2 z-[1] -mt-px -translate-x-1/2"
        fill="none"
        height={12}
        viewBox="0 0 14 12"
        width={14}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.92822 12L13.8564 0H0L6.92822 12Z" fill="var(--color-gray-10)" />
      </svg>
    </div>
  );
}
