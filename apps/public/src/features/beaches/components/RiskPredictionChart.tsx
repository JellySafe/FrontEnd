import { Badge } from "@jellysafe/design-system";
import { CONFIDENCE_LABEL, RISK_LABEL, TIME_FRAME_LABEL } from "@/shared/risk/types";
import type { RiskLevel, TimeFrame } from "@/shared/risk/types";
import type { BeachRiskPoint } from "../types";

// 막대 그라데이션: 상태색 -> 25% 투명. admin 차트와 동일 규칙.
const BAR_GRADIENT: Record<RiskLevel, string> = {
  safe: "from-[var(--color-safe-50)] to-[color-mix(in_srgb,var(--color-safe-50)_25%,transparent)]",
  caution: "from-[var(--color-caution-30)] to-[color-mix(in_srgb,var(--color-caution-30)_25%,transparent)]",
  danger: "from-[var(--color-danger-50)] to-[color-mix(in_srgb,var(--color-danger-50)_25%,transparent)]",
  critical: "from-[var(--color-critical-50)] to-[color-mix(in_srgb,var(--color-critical-50)_25%,transparent)]",
};

const DOT_CLASS: Record<RiskLevel, string> = {
  safe: "bg-[var(--color-safe-50)]",
  caution: "bg-[var(--color-caution-30)]",
  danger: "bg-[var(--color-danger-50)]",
  critical: "bg-[var(--color-critical-50)]",
};

const PLOT_HEADROOM = 40;

const CHART_TIME_FRAMES: TimeFrame[] = ["current", "after24h", "after72h"];

export type RiskPredictionChartProps = {
  timeline: BeachRiskPoint[];
  maxBarHeight?: number;
};

export function RiskPredictionChart({ timeline, maxBarHeight = 160 }: RiskPredictionChartProps) {
  const pointsByFrame = new Map(timeline.map((point) => [point.timeFrame, point]));

  return (
    <div className="relative flex flex-col gap-(--gap-3) rounded-2xl bg-bg-surface px-(--padding-3) py-(--padding-8)">
      <span className="absolute top-[16px] left-[16px] text-caption-small-mobile">
        <span className="text-text-primary">위험도</span>{" "}
        <span className="text-text-tertiary">(정확도)</span>
      </span>

      <div className="relative" style={{ height: maxBarHeight + PLOT_HEADROOM }}>
        <div className="grid h-full auto-cols-fr grid-flow-col">
          {CHART_TIME_FRAMES.map((timeFrame) => {
            const point = pointsByFrame.get(timeFrame);

            if (!point) {
              return (
                <div className="relative flex items-end justify-center pb-(--padding-6)" key={timeFrame}>
                  <span className="text-caption-small-mobile text-text-tertiary">준비 중</span>
                </div>
              );
            }

            const barHeight = (point.riskScore / 100) * maxBarHeight;

            return (
              <div className="relative" key={timeFrame}>
                <div
                  className={[
                    "absolute bottom-0 left-1/2 w-[38px] -translate-x-1/2 rounded-t-lg bg-gradient-to-b",
                    BAR_GRADIENT[point.risk],
                  ].join(" ")}
                  style={{ height: barHeight }}
                />
                <span
                  className={[
                    "absolute left-1/2 size-[8px] -translate-x-1/2 translate-y-1/2 rounded-full",
                    "border-[0.5px] border-[var(--color-alpha-white-100)]",
                    DOT_CLASS[point.risk],
                  ].join(" ")}
                  style={{ bottom: barHeight }}
                />
                <div
                  className="absolute left-1/2 flex -translate-x-1/2 items-start gap-(--gap-2) text-body-medium-mobile whitespace-nowrap"
                  style={{ bottom: barHeight + 8 }}
                >
                  <span className="text-text-primary">{point.riskScore}</span>
                  {/* API는 신뢰도 라벨(높음/보통/낮음)만 제공, 숫자 % 미표시 */}
                  <span className="text-text-tertiary">({CONFIDENCE_LABEL[point.confidence]})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid auto-cols-fr grid-flow-col">
        {CHART_TIME_FRAMES.map((timeFrame) => {
          const point = pointsByFrame.get(timeFrame);

          return (
            <div className="flex items-center justify-center gap-(--gap-2)" key={timeFrame}>
              <span
                className={[
                  "text-caption-medium-mobile",
                  point ? "text-text-secondary" : "text-text-tertiary",
                ].join(" ")}
              >
                {TIME_FRAME_LABEL[timeFrame]}
              </span>
              {point ? (
                <Badge platform="mobile" status={point.risk}>
                  {RISK_LABEL[point.risk]}
                </Badge>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
