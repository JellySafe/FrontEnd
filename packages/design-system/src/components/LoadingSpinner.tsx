import type { CSSProperties, HTMLAttributes } from "react";

export type LoadingSpinnerProps = Omit<HTMLAttributes<HTMLSpanElement>, "role"> & {
  size?: number;
  label?: string;
};

const FIGMA_BASE = 48;

// Figma loading/spiner(148:5051) 기준 — 링·팁 비율을 size에 맞게 스케일
export function LoadingSpinner({
  size = 24,
  label = "로딩 중",
  className,
  style,
  ...props
}: LoadingSpinnerProps) {
  const thickness = size * (4.8 / FIGMA_BASE);
  const tipSize = size * (4.8 / FIGMA_BASE);

  const ringStyle: CSSProperties = {
    background: "conic-gradient(from 0deg, currentColor 0deg, transparent 270deg)",
    WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
    mask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
  };

  const tipStyle: CSSProperties = {
    width: tipSize,
    height: tipSize,
    left: size * (43.2 / FIGMA_BASE),
    top: size * (21.48 / FIGMA_BASE),
  };

  return (
    <span
      aria-label={label}
      className={["relative inline-block shrink-0 text-text-brand", className]
        .filter(Boolean)
        .join(" ")}
      role="status"
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <span className="absolute inset-0 animate-spin motion-reduce:animate-none">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={ringStyle}
        />
        <span
          aria-hidden
          className="absolute rounded-full bg-current"
          style={tipStyle}
        />
      </span>
    </span>
  );
}
