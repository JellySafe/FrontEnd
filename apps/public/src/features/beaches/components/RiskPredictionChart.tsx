import { Badge } from "@jellysafe/design-system";
import { useId } from "react";
import { RISK_LABEL } from "@/shared/risk/types";
import type { HourlyRisk, RiskLevel } from "@/shared/risk/types";

// 막대 그라데이션: 상태색 -> 25% 투명. admin 차트와 동일 규칙.
const BAR_GRADIENT: Record<RiskLevel, string> = {
  safe: "from-[var(--color-safe-50)] to-[color-mix(in_srgb,var(--color-safe-50)_25%,transparent)]",
  caution: "from-[var(--color-caution-30)] to-[color-mix(in_srgb,var(--color-caution-30)_25%,transparent)]",
  danger: "from-[var(--color-danger-50)] to-[color-mix(in_srgb,var(--color-danger-50)_25%,transparent)]",
  critical: "from-[var(--color-critical-50)] to-[color-mix(in_srgb,var(--color-critical-50)_25%,transparent)]",
};

const RISK_STROKE: Record<RiskLevel, string> = {
  safe: "var(--color-safe-50)",
  caution: "var(--color-caution-30)",
  danger: "var(--color-danger-50)",
  critical: "var(--color-critical-50)",
};

const DOT_CLASS: Record<RiskLevel, string> = {
  safe: "bg-[var(--color-safe-50)]",
  caution: "bg-[var(--color-caution-30)]",
  danger: "bg-[var(--color-danger-50)]",
  critical: "bg-[var(--color-critical-50)]",
};

const PLOT_HEADROOM = 40;
const LINE_STROKE_WIDTH = 1.5;

export type RiskPredictionChartProps = {
  hourly: HourlyRisk[];
  maxBarHeight?: number;
};

export function RiskPredictionChart({ hourly, maxBarHeight = 160 }: RiskPredictionChartProps) {
  const gradientId = useId();

  const pointCoords = hourly.map((item, index) => ({
    x: ((index + 0.5) / hourly.length) * 100,
    y: 100 - item.score,
    risk: item.risk,
  }));
  const points = pointCoords.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="relative flex flex-col gap-(--gap-3) rounded-2xl bg-bg-surface px-(--padding-3) py-(--padding-8)">
      <span className="absolute top-[16px] left-[16px] text-caption-small-mobile">
        <span className="text-text-primary">위험도</span>{" "}
        <span className="text-text-tertiary">(정확도)</span>
      </span>

      <div className="relative" style={{ height: maxBarHeight + PLOT_HEADROOM }}>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
          style={{ height: maxBarHeight }}
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id={gradientId} x1="0" x2="100" y1="0" y2="0">
              {pointCoords.map((point) => (
                <stop
                  key={`${point.x}-${point.risk}`}
                  offset={`${point.x}%`}
                  stopColor={RISK_STROKE[point.risk]}
                />
              ))}
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            points={points}
            stroke={`url(#${gradientId})`}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={LINE_STROKE_WIDTH}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="grid h-full auto-cols-fr grid-flow-col">
          {hourly.map((item) => {
            const barHeight = (item.score / 100) * maxBarHeight;
            return (
              <div className="relative" key={item.timeFrame}>
                <div
                  className={[
                    "absolute bottom-0 left-1/2 w-[38px] -translate-x-1/2 rounded-t-lg bg-gradient-to-b",
                    BAR_GRADIENT[item.risk],
                  ].join(" ")}
                  style={{ height: barHeight }}
                />
                <span
                  className={[
                    "absolute left-1/2 size-[8px] -translate-x-1/2 translate-y-1/2 rounded-full",
                    "border-[0.5px] border-[var(--color-alpha-white-100)]",
                    DOT_CLASS[item.risk],
                  ].join(" ")}
                  style={{ bottom: barHeight }}
                />
                <div
                  className="absolute left-1/2 flex -translate-x-1/2 items-start gap-(--gap-2) text-body-medium-mobile whitespace-nowrap"
                  style={{ bottom: barHeight + 8 }}
                >
                  <span className="text-text-primary">{item.score}</span>
                  <span className="text-text-tertiary">({item.confidence}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid auto-cols-fr grid-flow-col">
        {hourly.map((item) => (
          <div className="flex items-center justify-center gap-(--gap-2)" key={item.timeFrame}>
            <span className="text-caption-medium-mobile text-text-secondary">{item.label}</span>
            <Badge platform="mobile" status={item.risk}>
              {RISK_LABEL[item.risk]}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
