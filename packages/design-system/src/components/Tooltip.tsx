"use client";

import { useId, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

export type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom";
  className?: string;
  triggerClassName?: string;
};

// hover와 keyboard focus 모두에서 열리는 접근성 툴팁. 화살표는 CSS 삼각형으로 처리.
export function Tooltip({
  content,
  children,
  side = "top",
  className,
  triggerClassName,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  const show = () => setOpen(true);
  const hide = () => setOpen(false);
  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Escape") {
      hide();
    }
  };

  return (
    <span className="relative inline-flex">
      <span
        aria-describedby={open ? tooltipId : undefined}
        className={["inline-flex", triggerClassName].filter(Boolean).join(" ")}
        onBlur={hide}
        onFocus={show}
        onKeyDown={handleKeyDown}
        onMouseEnter={show}
        onMouseLeave={hide}
        tabIndex={0}
      >
        {children}
      </span>
      {open ? (
        <span
          className={[
            "pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 rounded-lg bg-[var(--color-gray-10)] px-(--padding-3) py-(--padding-2) text-center text-caption-medium-mobile text-text-tertiary drop-shadow-[0_0_4px_var(--color-alpha-black-5)]",
            side === "top" ? "bottom-[calc(100%+7px)]" : "top-[calc(100%+7px)]",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          id={tooltipId}
          role="tooltip"
        >
          {content}
          <span
            aria-hidden="true"
            className={[
              "absolute left-1/2 size-0 -translate-x-1/2 border-x-8 border-x-transparent",
              side === "top"
                ? "top-full border-t-8 border-t-[var(--color-gray-10)]"
                : "bottom-full border-b-8 border-b-[var(--color-gray-10)]",
            ].join(" ")}
          />
        </span>
      ) : null}
    </span>
  );
}
