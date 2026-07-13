import { RiskSummaryCard } from "@/shared/ui/RiskSummaryCard";
import { RefreshIcon } from "@/shared/ui/icons";
import { RISK_LABEL } from "../types";
import type { DashboardStat } from "../types";

export type DashboardStatsProps = {
  title: string;
  timestamp: string;
  stats: DashboardStat[];
};

export function DashboardStats({ title, timestamp, stats }: DashboardStatsProps) {
  return (
    <section className="flex flex-col gap-(--gap-3)">
      <div className="flex flex-col gap-(--gap-2)">
        <h2 className="text-heading-xsmall-pc text-text-primary">{title}</h2>
        <p className="flex items-center gap-(--gap-2) text-caption-small-pc text-text-tertiary">
          {timestamp}
          <RefreshIcon className="size-[16px] text-icon-tertiary" />
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
