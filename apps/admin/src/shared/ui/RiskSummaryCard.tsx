import { Badge, Card } from "@jellysafe/design-system";
import type { BadgeStatus } from "@jellysafe/design-system";
import type { ReactNode } from "react";

export type RiskSummaryCardProps = {
  label: ReactNode;
  value: ReactNode;
  status?: BadgeStatus;
  statusLabel?: ReactNode;
  delta?: ReactNode;
  deltaCaption?: ReactNode;
  className?: string;
};

export function RiskSummaryCard({
  label,
  value,
  status,
  statusLabel,
  delta,
  deltaCaption,
  className,
}: RiskSummaryCardProps) {
  return (
    <Card
      className={["flex flex-col gap-(--gap-2) p-(--padding-7)", className]
        .filter(Boolean)
        .join(" ")}
      variant="surface"
    >
      <div className="flex items-center justify-between">
        <span className="text-caption-medium-pc text-text-secondary">{label}</span>
        {status ? (
          <Badge platform="pc" status={status}>
            {statusLabel}
          </Badge>
        ) : null}
      </div>
      <p className="text-heading-xlarge-pc text-text-primary">{value}</p>
      {delta || deltaCaption ? (
        <div className="flex items-start gap-(--gap-2)">
          {delta ? (
            <span className="text-caption-medium-pc text-text-secondary">
              {delta}
            </span>
          ) : null}
          {deltaCaption ? (
            <span className="text-caption-small-pc text-text-tertiary">
              {deltaCaption}
            </span>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
