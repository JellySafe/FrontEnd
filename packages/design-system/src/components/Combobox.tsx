"use client";

import { useId } from "react";
import type { ButtonHTMLAttributes } from "react";

const UP_DOWN_PATH =
  "M18.2073 9.04256L12.0002 2.83545L5.79312 9.04256L7.20733 10.4568L12.0002 5.66388L16.7931 10.4568L18.2073 9.04256ZM5.79297 14.957L12.0001 21.1641L18.2072 14.957L16.7929 13.5428L12.0001 18.3357L7.20718 13.5428L5.79297 14.957Z";

export type ComboboxAction = {
  label: string;
  onClick: () => void;
};

export type ComboboxProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> & {
  label?: string;
  value?: string;
  placeholder?: string;
  action?: ComboboxAction;
};

export function Combobox({
  label,
  value,
  placeholder = "",
  action,
  id,
  className,
  disabled,
  "aria-haspopup": ariaHasPopup = "dialog",
  ...props
}: ComboboxProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const labelId = `${triggerId}-label`;
  const hasValue = value != null && value !== "";

  return (
    <div className="flex w-full flex-col gap-(--gap-2)">
      {label ? (
        <span
          className="text-caption-medium-mobile text-text-tertiary"
          id={labelId}
        >
          {label}
        </span>
      ) : null}
      <button
        aria-haspopup={ariaHasPopup}
        aria-labelledby={label ? labelId : undefined}
        className={[
          "flex w-full items-center gap-(--gap-3) rounded-lg border border-border-default bg-bg-default px-(--padding-5) py-(--padding-4) text-left",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        disabled={disabled}
        id={triggerId}
        type="button"
        {...props}
      >
        <span
          className={[
            "min-w-0 flex-1 truncate",
            hasValue
              ? "text-body-xsmall-mobile text-text-primary"
              : "text-body-xxsmall-mobile text-text-tertiary",
          ].join(" ")}
        >
          {hasValue ? value : placeholder}
        </span>
        <svg
          aria-hidden="true"
          className="size-(--icon-size-24) shrink-0 text-icon-secondary"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d={UP_DOWN_PATH} fill="currentColor" />
        </svg>
      </button>
      {action ? (
        <div className="flex justify-end">
          <button
            className="rounded-sm px-(--padding-3) py-(--padding-2) text-caption-medium-mobile text-text-brand underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
            onClick={action.onClick}
            type="button"
          >
            {action.label}
          </button>
        </div>
      ) : null}
    </div>
  );
}
