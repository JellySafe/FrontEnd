import type { ReactNode } from "react";

const PIN_PATH =
  "M2.65723 2.65723C5.60785 -0.293393 10.3921 -0.293395 13.3428 2.65723C16.2934 5.60785 16.2934 10.3921 13.3428 13.3428L8 18.6846L2.65723 13.3428C-0.293394 10.3921 -0.293393 5.60785 2.65723 2.65723ZM8 4.88867C6.27498 4.88867 4.88867 6.34721 4.88867 8C4.88868 9.6424 6.17161 11.1113 8 11.1113C9.60745 11.1113 11.1113 9.66416 11.1113 8C11.1113 6.34722 9.72502 4.88868 8 4.88867Z";

export type MapPinStatus = "critical" | "danger" | "caution" | "safe" | "primary";
export type MapPinState = "default" | "focused" | "focused-raised";

export type MapPinProps = {
  status: MapPinStatus;
  state?: MapPinState;
  label?: ReactNode;
  className?: string;
};

const STATUS_COLOR: Record<MapPinStatus, string> = {
  critical: "text-[var(--color-critical-50)]",
  danger: "text-[var(--color-danger-50)]",
  caution: "text-[var(--color-caution-30)]",
  safe: "text-[var(--color-safe-50)]",
  primary: "text-[var(--color-primary-50)]",
};

export function MapPin({ status, state = "default", label, className }: MapPinProps) {
  const showHalo = state !== "default";
  // focused-raised: Figma focused1↔focused2 오르락내리락. focused는 헤일로만.
  const isBobbing = state === "focused-raised";
  return (
    <div
      className={["relative h-[40px] w-[16px]", STATUS_COLOR[status], className]
        .filter(Boolean)
        .join(" ")}
    >
      {showHalo ? (
        <svg
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 h-[6px] w-[16px] -translate-x-1/2 -translate-y-1/2"
          fill="none"
          viewBox="0 0 16 6"
        >
          <ellipse cx="8" cy="3" fill="currentColor" fillOpacity="0.5" rx="8" ry="3" />
        </svg>
      ) : null}
      <svg
        aria-hidden="true"
        className={[
          "absolute left-1/2 h-[19.314px] w-[16px] -translate-x-1/2 -translate-y-1/2",
          isBobbing ? "animate-map-pin-bob" : "top-[calc(50%-9.34px)]",
        ].join(" ")}
        fill="none"
        viewBox="0 0 16 19.3137"
      >
        <path
          d={PIN_PATH}
          fill="currentColor"
          stroke="var(--color-bg-surface)"
          strokeWidth="0.888888"
        />
      </svg>
      {label ? (
        <span className="absolute top-[22px] left-[calc(50%+0.5px)] w-max max-w-[80px] -translate-x-1/2 text-center text-[10px] leading-[1.5] font-medium tracking-[-0.025em] text-text-primary">
          {label}
        </span>
      ) : null}
    </div>
  );
}
