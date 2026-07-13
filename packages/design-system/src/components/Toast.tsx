import type { HTMLAttributes, ReactNode } from "react";

export type ToastProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

// Figma toast: 상단 중앙 알림. brand 텍스트 + default 보더/그림자.
export function Toast({ children, className, ...props }: ToastProps) {
  return (
    <div
      className={[
        "inline-flex items-center justify-center rounded-lg border border-border-default bg-bg-default px-(--padding-5) py-(--padding-3) text-body-large-pc whitespace-nowrap text-text-brand drop-shadow-[0_0_4px_var(--color-alpha-black-5)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      {...props}
    >
      {children}
    </div>
  );
}
