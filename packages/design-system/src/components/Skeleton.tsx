import type { HTMLAttributes } from "react";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

// 로딩 자리표시자. 크기·radius는 className으로 지정. reduced-motion 대응.
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        // Figma Skeleton Pulse: gray-10 ↔ gray-20 (opacity pulse 아님)
        "animate-skeleton-pulse bg-[var(--color-gray-10)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
