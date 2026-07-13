import type { CSSProperties, HTMLAttributes } from "react";

export type LoadingSpinnerProps = Omit<HTMLAttributes<HTMLSpanElement>, "role"> & {
  size?: number;
  label?: string;
};

// conic-gradient 링을 radial mask로 뚫어 만든 스피너. 색은 currentColor(기본 brand).
export function LoadingSpinner({
  size = 24,
  label = "로딩 중",
  className,
  style,
  ...props
}: LoadingSpinnerProps) {
  const thickness = Math.max(2, Math.round(size / 8));
  const ring: CSSProperties = {
    width: size,
    height: size,
    background: "conic-gradient(from 90deg, transparent 0deg, currentColor 360deg)",
    WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), black calc(100% - ${thickness}px))`,
    mask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), black calc(100% - ${thickness}px))`,
    ...style,
  };

  return (
    <span
      aria-label={label}
      className={[
        "inline-block shrink-0 animate-spin rounded-full text-text-brand motion-reduce:animate-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      style={ring}
      {...props}
    />
  );
}
