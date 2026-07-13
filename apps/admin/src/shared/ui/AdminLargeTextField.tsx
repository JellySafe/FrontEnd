"use client";

import { Button } from "@jellysafe/design-system";
import { useId, useState } from "react";
import type {
  FocusEventHandler,
  TextareaHTMLAttributes,
} from "react";
import { useScrollIndicator } from "@/shared/hooks/useScrollIndicator";

export type AdminLargeTextFieldState =
  | "default"
  | "focused"
  | "completed"
  | "error"
  | "loading";

export type AdminLargeTextFieldProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "state" | "className"
> & {
  /** 미지정 시 라벨 행을 렌더하지 않음 (섹션 제목을 밖에 두는 경우) */
  label?: string;
  state?: AdminLargeTextFieldState;
  error?: string;
  actionLabel: string;
  onAction: () => void;
  /** 미지정 시 state 기본값(default/completed/loading)에 따라 버튼 비활성화 */
  actionDisabled?: boolean;
  /** 액션 버튼 variant. 기본 primary */
  actionVariant?: "primary" | "secondary";
  /** 외부 wrapper에 적용할 className */
  className?: string;
};

function LoadingSpinner() {
  return (
    <span
      aria-hidden="true"
      className="relative size-(--icon-size-24) shrink-0 animate-spin bg-[url('/assets/loading-spinner-body.png')] bg-contain bg-center bg-no-repeat motion-reduce:animate-none"
    >
      <span className="absolute bottom-0 left-1/2 size-[2.4px] -translate-x-1/2 bg-[url('/assets/loading-spinner-dot.svg')] bg-contain bg-center bg-no-repeat" />
    </span>
  );
}

export function AdminLargeTextField({
  label,
  state = "default",
  error,
  actionLabel,
  onAction,
  actionDisabled,
  actionVariant = "primary",
  id,
  className,
  onFocus,
  onBlur,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: AdminLargeTextFieldProps) {
  const generatedId = useId();
  const textareaRef = useScrollIndicator<HTMLTextAreaElement>();
  const textareaId = id ?? generatedId;
  const helperId = `${textareaId}-helper`;
  const [hasFocus, setHasFocus] = useState(false);
  const hasError = state === "error";
  const isLoading = state === "loading";
  const hasBrandBorder = state === "focused" || hasFocus;
  const isActionDisabled =
    actionDisabled ??
    (state === "default" || state === "completed" || isLoading);
  const describedBy = [
    ariaDescribedBy,
    hasError && error ? helperId : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  const handleFocus: FocusEventHandler<HTMLTextAreaElement> = (event) => {
    setHasFocus(true);
    onFocus?.(event);
  };

  const handleBlur: FocusEventHandler<HTMLTextAreaElement> = (event) => {
    setHasFocus(false);
    onBlur?.(event);
  };

  return (
    <div
      className={[
        "flex h-[488px] w-full flex-col gap-(--gap-2)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label ? (
        <label
          className="text-caption-medium-pc text-text-tertiary"
          htmlFor={textareaId}
        >
          {label}
        </label>
      ) : null}
      <div
        className={[
          "flex min-h-0 flex-1 flex-col rounded-lg border bg-bg-default px-(--padding-5) py-(--padding-4)",
          // Figma large/error: 박스는 default border 유지, 에러는 하단 헬퍼 텍스트로만 표시
          hasBrandBorder && !hasError
            ? "border-border-brand"
            : "border-border-default",
        ].join(" ")}
      >
        {isLoading ? (
          <span
            aria-live="polite"
            className="flex items-center gap-(--gap-3) text-body-xxsmall-pc text-text-secondary"
            role="status"
          >
            <LoadingSpinner />
            생성중...
          </span>
        ) : null}
        <textarea
          aria-busy={isLoading || undefined}
          aria-describedby={describedBy || undefined}
          aria-invalid={hasError ? true : ariaInvalid}
          className={[
            // 고정 높이 안에서 내부 스크롤만 발생시키고, 스크롤바는 스크롤 중에만 얇게 표시
            "scrollbar-indicator min-h-0 w-full flex-1 resize-none overflow-y-auto bg-transparent text-body-xxsmall-pc text-text-primary outline-none placeholder:text-text-tertiary",
            isLoading ? "hidden" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          id={textareaId}
          onBlur={handleBlur}
          onFocus={handleFocus}
          ref={textareaRef}
          {...props}
        />
      </div>
      <div className="flex h-12 w-full shrink-0 items-center justify-between gap-(--gap-2)">
        {hasError && error ? (
          <p
            className="w-[416px] shrink whitespace-pre-line text-caption-medium-pc text-text-error"
            id={helperId}
          >
            {error}
          </p>
        ) : (
          <span aria-hidden="true" className="min-w-0 flex-1" />
        )}
        <Button
          className="w-[120px] shrink-0"
          disabled={isActionDisabled}
          onClick={onAction}
          platform="pc"
          size="medium"
          type="button"
          variant={actionVariant}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
