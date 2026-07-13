"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

export type SearchFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  value: string;
  onValueChange: (value: string) => void;
  trailing?: ReactNode;
};

// 라벨 없는 검색 입력 박스(홈 검색/위치 검색 공용). trailing으로 화면별 아이콘 구성.
export function SearchField({
  value,
  onValueChange,
  trailing,
  className,
  ...props
}: SearchFieldProps) {
  return (
    <div
      className={[
        "flex w-full items-center gap-(--gap-3) rounded-lg border border-border-default bg-bg-default px-(--padding-5) py-(--padding-4)",
        "focus-within:border-border-brand",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        {...props}
        className="min-w-0 flex-1 bg-transparent text-body-xxsmall-mobile text-text-primary outline-none placeholder:text-text-tertiary"
        onChange={(event) => onValueChange(event.target.value)}
        type="text"
        value={value}
      />
      {trailing ? (
        <div className="flex shrink-0 items-center gap-(--gap-3)">{trailing}</div>
      ) : null}
    </div>
  );
}
