import type { CSSProperties, HTMLAttributes } from "react";

export type LoadingSpinnerProps = Omit<HTMLAttributes<HTMLSpanElement>, "role"> & {
  size?: number;
  label?: string;
};

const FIGMA_BASE = 48;
/** Figma stroke / tip 직경 (loading/spiner 기준) */
const FIGMA_STROKE = 4.8;

/**
 * Figma loading/spiner(148:5051) — 단일 레이어.
 * tip을 별도 원으로 올리면 호와 겹쳐 보이므로, radial tip + conic 페이드를 한 background에 합친다.
 */
export function LoadingSpinner({
  size = 24,
  label = "로딩 중",
  className,
  style,
  ...props
}: LoadingSpinnerProps) {
  const stroke = Math.max(2, (size * FIGMA_STROKE) / FIGMA_BASE);

  const spinnerStyle: CSSProperties = {
    width: size,
    height: size,
    // tip(앞머리) + 약 270° 페이드 호. mask로 링만 남김.
    background: [
      `radial-gradient(farthest-side, currentColor 94%, transparent) top / ${stroke}px ${stroke}px no-repeat`,
      "conic-gradient(transparent 25%, currentColor)",
    ].join(", "),
    WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${stroke}px), #000 0)`,
    mask: `radial-gradient(farthest-side, transparent calc(100% - ${stroke}px), #000 0)`,
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
      style={spinnerStyle}
      {...props}
    />
  );
}
