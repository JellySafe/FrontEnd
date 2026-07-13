"use client";

import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

export type ChipProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  children: ReactNode;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
};

export function Chip({
  children,
  selected = false,
  onSelectedChange,
  disabled,
  className,
  onClick,
  ...props
}: ChipProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    onSelectedChange?.(!selected);
  };

  return (
    <button
      aria-pressed={selected}
      className={[
        "inline-flex h-[30px] items-center justify-center rounded-lg border bg-bg-default px-(--padding-3) py-(--padding-2) text-caption-small-pc whitespace-nowrap",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        selected
          ? "border-border-brand text-text-brand"
          : "border-border-default text-text-tertiary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      onClick={handleClick}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
