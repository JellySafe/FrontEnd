import type { HTMLAttributes, Ref } from "react";

export type CardVariant = "surface" | "outlined";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  ref?: Ref<HTMLDivElement>;
};

const VARIANT_CLASSES: Record<CardVariant, string> = {
  surface: "bg-bg-surface",
  outlined: "border border-border-default bg-bg-default",
};

export function Card({ variant = "surface", className, ...props }: CardProps) {
  return (
    <div
      className={["rounded-2xl", VARIANT_CLASSES[variant], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
