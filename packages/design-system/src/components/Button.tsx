import type { ButtonHTMLAttributes } from "react";

type ButtonBaseProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">;

type PcButtonProps = {
  platform?: "pc";
  variant?: "primary" | "secondary";
  size?: "small" | "medium";
  isSelected?: never;
};

type MobileButtonProps =
  | {
      platform: "mobile";
      variant?: "primary";
      size?: "small" | "medium";
      isSelected?: never;
    }
  | {
      platform: "mobile";
      variant: "secondary";
      size?: "medium";
      isSelected?: never;
    }
  | {
      platform: "mobile";
      variant: "tertiary";
      size?: "medium";
      isSelected?: boolean;
    };

export type ButtonProps = ButtonBaseProps & (PcButtonProps | MobileButtonProps);

const VARIANT_CLASSES = {
  primary:
    "bg-button-primary-fill text-text-inverse enabled:hover:bg-button-primary-fill-hover enabled:active:bg-button-primary-fill-pressed",
  secondary:
    "bg-button-secondary-fill text-text-brand enabled:hover:bg-button-secondary-fill-hover enabled:active:bg-button-secondary-fill-pressed",
  // 미선택: gray fill + gray border. 선택은 아래 TERTIARY_SELECTED로만 적용(유틸 충돌 방지).
  tertiary:
    "border border-button-tertiary-border bg-button-tertiary-fill text-text-tertiary enabled:hover:bg-button-tertiary-fill-hover enabled:active:bg-button-tertiary-fill-pressed",
} as const;

/** Figma mobile tertiary/selected: brand border + primary-10 fill + brand text (호버/프레스 없음) */
const TERTIARY_SELECTED_CLASSES =
  "border border-border-brand bg-button-tertiary-fill-selected text-text-brand";

export function Button({
  platform = "pc",
  variant = "primary",
  size = "medium",
  isSelected,
  disabled,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const isMobile = platform === "mobile";
  const isSmall = size === "small";
  const isTertiarySelected = variant === "tertiary" && isSelected === true;

  return (
    <button
      aria-pressed={variant === "tertiary" ? isSelected : undefined}
      className={[
        // Figma radius/small = 8px (rounded-lg). rounded-2xl(16)은 디자인과 불일치.
        "inline-flex items-center justify-center rounded-lg px-(--padding-5) whitespace-nowrap",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]",
        "disabled:cursor-not-allowed disabled:bg-button-disabled-fill disabled:text-text-disabled",
        isTertiarySelected ? TERTIARY_SELECTED_CLASSES : VARIANT_CLASSES[variant],
        !isMobile && variant === "secondary" && isSmall && disabled
          ? "disabled:bg-button-disabled-border"
          : "",
        isSmall
          ? isMobile
            ? "py-(--padding-3) text-caption-large-mobile"
            : "py-(--padding-3) text-caption-large-pc"
          : isMobile
            ? "py-(--padding-4) text-body-small-mobile"
            : "py-(--padding-4) text-body-small-pc",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      type={type}
      {...props}
    />
  );
}
