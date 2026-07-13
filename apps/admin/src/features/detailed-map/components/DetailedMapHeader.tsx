"use client";

import { Badge } from "@jellysafe/design-system";
import type { RiskLevel } from "@/shared/risk/types";
import { ChevronLeftIcon } from "@/shared/ui/icons";

export type DetailedMapHeaderProps = {
  title: string;
  backLabel: string;
  onBack: () => void;
  risk?: RiskLevel;
  riskLabel?: string;
};

// 상세 화면 전용 헤더(뒤로 가기 + 제목 + 선택적 위험 배지).
export function DetailedMapHeader({
  title,
  backLabel,
  onBack,
  risk,
  riskLabel,
}: DetailedMapHeaderProps) {
  return (
    <header className="flex items-center gap-(--gap-3) py-(--padding-5)">
      <button
        aria-label={backLabel}
        className="flex shrink-0 items-center text-icon-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
        onClick={onBack}
        type="button"
      >
        <ChevronLeftIcon className="size-[24px]" />
      </button>
      <h1 className="truncate text-heading-small-pc text-text-primary">{title}</h1>
      {risk && riskLabel ? <Badge status={risk}>{riskLabel}</Badge> : null}
    </header>
  );
}
