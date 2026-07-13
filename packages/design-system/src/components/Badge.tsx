import type { HTMLAttributes } from "react";

export type BadgeStatus = "critical" | "danger" | "caution" | "safe";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status: BadgeStatus;
  platform?: "pc" | "mobile";
};

// 배경 = 상태색 25% over white, 텍스트 = 상태색 50 (caution만 배경 30 / 텍스트 50)
const STATUS_CLASSES: Record<BadgeStatus, string> = {
  critical:
    "bg-[color-mix(in_srgb,var(--color-critical-50)_25%,white)] text-[var(--color-critical-50)]",
  danger:
    "bg-[color-mix(in_srgb,var(--color-danger-50)_25%,white)] text-[var(--color-danger-50)]",
  caution:
    "bg-[color-mix(in_srgb,var(--color-caution-30)_25%,white)] text-[var(--color-caution-50)]",
  safe: "bg-[color-mix(in_srgb,var(--color-safe-50)_25%,white)] text-[var(--color-safe-50)]",
};

export function Badge({
  status,
  platform = "pc",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-sm px-(--padding-2) py-(--padding-1) whitespace-nowrap",
        platform === "mobile"
          ? "text-caption-medium-mobile"
          : "text-caption-medium-pc",
        STATUS_CLASSES[status],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
