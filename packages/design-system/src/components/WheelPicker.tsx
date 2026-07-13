"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

const ITEM_HEIGHT = 40;
const MASK_HEIGHT = 20;

export type WheelPickerOption = {
  value: string;
  label: ReactNode;
};

export type WheelPickerColumn = {
  key: string;
  options: WheelPickerOption[];
  value: string;
  flex?: boolean;
  "aria-label"?: string;
};

export type WheelPickerProps = {
  columns: WheelPickerColumn[];
  onChange: (key: string, value: string) => void;
  visibleCount?: number;
  className?: string;
};

function WheelColumn({
  column,
  visibleCount,
  onChange,
}: {
  column: WheelPickerColumn;
  visibleCount: number;
  onChange: (key: string, value: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const pad = (ITEM_HEIGHT * (visibleCount - 1)) / 2;
  const selectedIndex = Math.max(
    0,
    column.options.findIndex((option) => option.value === column.value),
  );

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTop = selectedIndex * ITEM_HEIGHT;
  }, [selectedIndex]);

  const handleScroll = () => {
    const element = scrollRef.current;
    if (!element) return;
    window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      const index = Math.round(element.scrollTop / ITEM_HEIGHT);
      const clamped = Math.min(Math.max(index, 0), column.options.length - 1);
      const option = column.options[clamped];
      if (option && option.value !== column.value) {
        onChange(column.key, option.value);
      }
    });
  };

  return (
    <div
      aria-label={column["aria-label"]}
      className={[
        "snap-y snap-mandatory overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        column.flex ? "flex-1" : "w-[70px]",
      ].join(" ")}
      onScroll={handleScroll}
      ref={scrollRef}
      role="listbox"
      style={{ height: ITEM_HEIGHT * visibleCount }}
    >
      <div style={{ paddingTop: pad, paddingBottom: pad }}>
        {column.options.map((option) => {
          const isSelected = option.value === column.value;
          return (
            <div
              aria-selected={isSelected}
              className={[
                "flex snap-center items-center justify-center px-(--padding-5) text-center whitespace-nowrap",
                isSelected
                  ? "text-body-large-mobile text-text-brand"
                  : "text-body-xxsmall-mobile text-text-tertiary",
              ].join(" ")}
              key={option.value}
              role="option"
              style={{ height: ITEM_HEIGHT }}
            >
              {option.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WheelPicker({
  columns,
  onChange,
  visibleCount = 5,
  className,
}: WheelPickerProps) {
  const height = ITEM_HEIGHT * visibleCount;
  const bandTop = (height - ITEM_HEIGHT) / 2;

  return (
    <div
      className={[
        "relative flex items-center gap-(--gap-3) overflow-hidden bg-bg-default px-(--padding-3)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ height }}
    >
      {columns.map((column) => (
        <WheelColumn
          column={column}
          key={column.key}
          onChange={onChange}
          visibleCount={visibleCount}
        />
      ))}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 border-y border-border-default"
        style={{ top: bandTop, height: ITEM_HEIGHT }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[var(--color-alpha-white-75)] to-[var(--color-alpha-white-0)]"
        style={{ height: MASK_HEIGHT }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-alpha-white-75)] to-[var(--color-alpha-white-0)]"
        style={{ height: MASK_HEIGHT }}
      />
    </div>
  );
}
