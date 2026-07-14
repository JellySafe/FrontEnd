import { RiskSummaryCard } from "@/shared/ui/RiskSummaryCard";
import { RefreshIcon } from "@/shared/ui/icons";
import { RISK_LABEL } from "../types";
import type { DashboardStat } from "../types";

export type DashboardStatsProps = {
  title: string;
  timestamp: string;
  stats: DashboardStat[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

export function DashboardStats({
  title,
  timestamp,
  stats,
  onRefresh,
  isRefreshing = false,
}: DashboardStatsProps) {
  return (
    <section className="flex flex-col gap-(--gap-3)">
      <div className="flex flex-col gap-(--gap-2)">
        <h2 className="text-heading-xsmall-pc text-text-primary">{title}</h2>
        <p className="flex items-center gap-(--gap-2) text-caption-small-pc text-text-tertiary">
          {timestamp}
          <button
            aria-label="새로고침"
            className="text-icon-tertiary disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isRefreshing || !onRefresh}
            onClick={onRefresh}
            type="button"
          >
            <RefreshIcon
              className={[
                "size-[16px]",
                isRefreshing ? "animate-spin" : "",
              ].join(" ")}
            />
          </button>
        </p>
      </div>
      <div className="grid grid-cols-5 gap-(--gap-4)">
        {stats.map((stat) => (
          <RiskSummaryCard
            delta={stat.delta}
            deltaCaption={stat.deltaCaption}
            key={stat.id}
            label={stat.label}
            status={stat.status}
            statusLabel={stat.status ? (stat.statusLabel ?? RISK_LABEL[stat.status]) : undefined}
            value={stat.value}
          />
        ))}
      </div>
    </section>
  );
}
