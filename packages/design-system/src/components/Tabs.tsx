"use client";

import { useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";

export type TabItem = {
  value: string;
  label: ReactNode;
  hasNew?: boolean;
  controls?: string;
};

export type TabsProps = {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  variant?: "segmented" | "line";
  className?: string;
  "aria-label"?: string;
};

export function Tabs({
  items,
  value,
  onValueChange,
  variant = "segmented",
  className,
  "aria-label": ariaLabel,
}: TabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isSegmented = variant === "segmented";

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    onValueChange(items[nextIndex].value);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      aria-label={ariaLabel}
      className={[
        isSegmented
          ? "inline-flex items-center justify-center gap-(--gap-2) rounded-2xl bg-bg-surface p-(--padding-2)"
          : "inline-flex items-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="tablist"
    >
      {items.map((item, index) => {
        const isSelected = item.value === value;
        return (
          <button
            aria-controls={item.controls}
            aria-selected={isSelected}
            className={[
              "relative flex items-center justify-center overflow-visible whitespace-nowrap",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]",
              isSegmented
                ? [
                    "rounded-xl px-(--padding-3) py-(--padding-2)",
                    isSelected
                      ? "bg-bg-default text-caption-large-pc text-text-primary"
                      : "text-caption-medium-pc text-text-disabled",
                  ].join(" ")
                : [
                    "px-(--padding-3) py-(--padding-2) text-body-large-mobile",
                    isSelected
                      ? "border-b border-border-strong text-text-primary"
                      : "text-text-disabled",
                  ].join(" "),
            ].join(" ")}
            key={item.value}
            onClick={() => onValueChange(item.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            role="tab"
            tabIndex={isSelected ? 0 : -1}
            type="button"
          >
            {item.label}
            {item.hasNew ? (
              <span
                aria-hidden="true"
                className="absolute top-[2px] -right-[2px] size-[8px] rounded-full bg-bg-strong"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
