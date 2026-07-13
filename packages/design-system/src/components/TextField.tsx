"use client";

import { useId } from "react";
import type {
  InputHTMLAttributes,
  MouseEventHandler,
} from "react";

export type TextFieldState = "default" | "completed" | "error";

export type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "state"
> & {
  platform?: "pc" | "mobile";
  label: string;
  state?: TextFieldState;
  error?: string;
  onClear?: MouseEventHandler<HTMLButtonElement>;
};

const X_PATH =
  "M11.5 10.4445L16.9445 5L18.5 6.55555L13.0555 12L18.5 17.4444L16.9445 18.9999L11.5 13.5555L6.05556 18.9999L4.5 17.4444L9.94444 12L4.5 6.55555L6.05556 5L11.5 10.4445Z";

export function TextField({
  platform = "pc",
  label,
  state = "default",
  error,
  onClear,
  id,
  className,
  disabled,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const isMobile = platform === "mobile";
  const hasError = state === "error";
  const describedBy = [ariaDescribedBy, hasError && error ? helperId : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={[
        "flex w-full flex-col gap-(--gap-2)",
        isMobile ? "max-w-[328px]" : "max-w-[426px]",
      ].join(" ")}
    >
      <label
        className={
          isMobile
            ? "text-caption-medium-mobile text-text-tertiary"
            : "text-caption-medium-pc text-text-tertiary"
        }
        htmlFor={inputId}
      >
        {label}
      </label>
      <div
        className={[
          "flex items-center gap-(--gap-2) rounded-lg border bg-bg-default px-(--padding-5) py-(--padding-4)",
          hasError
            ? "border-border-error focus-within:border-border-error"
            : "border-border-default focus-within:border-border-brand",
        ].join(" ")}
      >
        <input
          aria-describedby={describedBy || undefined}
          aria-invalid={hasError ? true : ariaInvalid}
          className={[
            "min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-tertiary",
            isMobile ? "text-body-xxsmall-mobile" : "text-body-xxsmall-pc",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          disabled={disabled}
          id={inputId}
          {...props}
        />
        {onClear ? (
          <button
            aria-label="입력 내용 지우기"
            className="shrink-0 rounded-sm bg-bg-surface p-(--padding-1) text-icon-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
            disabled={disabled}
            onClick={onClear}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="size-(--icon-size-20)"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path d={X_PATH} fill="currentColor" />
            </svg>
          </button>
        ) : null}
      </div>
      {hasError && error ? (
        <p
          className={
            isMobile
              ? "text-caption-small-mobile text-text-error"
              : "text-caption-small-pc text-text-error"
          }
          id={helperId}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
