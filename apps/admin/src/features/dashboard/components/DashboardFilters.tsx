"use client";

import { Button, Chip } from "@jellysafe/design-system";
import type { ReactNode } from "react";
import { FilterIcon } from "@/shared/ui/icons";
import { RISK_LABEL, RISK_ORDER, TIME_FILTER_LABEL } from "../types";
import type { DashboardFilterState, RiskLevel, TimeFrame } from "../types";

const TIME_OPTIONS: TimeFrame[] = ["current", "after24h", "after72h"];

export type DashboardFiltersProps = {
  isOpen: boolean;
  draft: DashboardFilterState;
  appliedCount: number;
  previewCount: number;
  canReset: boolean;
  onToggle: () => void;
  onToggleRisk: (risk: RiskLevel) => void;
  onSetTime: (time: TimeFrame) => void;
  onSetUnidentified: (value: boolean) => void;
  onReset: () => void;
  onApply: () => void;
};

export function DashboardFilters({
  isOpen,
  draft,
  appliedCount,
  previewCount,
  canReset,
  onToggle,
  onToggleRisk,
  onSetTime,
  onSetUnidentified,
  onReset,
  onApply,
}: DashboardFiltersProps) {
  return (
    <div className="absolute top-[30px] right-[30px] z-30 flex flex-col items-end gap-(--gap-3)">
      <button
        aria-expanded={isOpen}
        aria-label="필터 설정"
        className="flex items-center gap-(--gap-2) rounded-lg bg-bg-default p-(--padding-3) text-icon-secondary shadow-[0_0_4px_var(--color-alpha-black-5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
        onClick={onToggle}
        type="button"
      >
        <FilterIcon className="size-[24px]" />
        {appliedCount > 0 ? (
          <span className="text-caption-large-pc text-text-primary">{appliedCount}</span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="flex w-[280px] flex-col gap-(--gap-5) rounded-lg bg-bg-default p-(--padding-7) shadow-[0_0_4px_var(--color-alpha-black-5)]">
          <FilterGroup label="위험도">
            {RISK_ORDER.map((risk) => (
              <Chip key={risk} onSelectedChange={() => onToggleRisk(risk)} selected={draft.risks.includes(risk)}>
                {RISK_LABEL[risk]}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label="시간">
            {TIME_OPTIONS.map((time) => (
              <Chip key={time} onSelectedChange={() => onSetTime(time)} selected={draft.time === time}>
                {TIME_FILTER_LABEL[time]}
              </Chip>
            ))}
          </FilterGroup>

          <FilterGroup label="미확인 제보 여부">
            <Chip onSelectedChange={() => onSetUnidentified(true)} selected={draft.unidentified === true}>
              있음
            </Chip>
            <Chip onSelectedChange={() => onSetUnidentified(false)} selected={draft.unidentified === false}>
              없음
            </Chip>
          </FilterGroup>

          <div className="flex items-center gap-(--gap-3)">
            <Button className="flex-1" disabled={!canReset} onClick={onReset} size="small" variant="secondary">
              초기화
            </Button>
            <Button className="flex-1" onClick={onApply} size="small" variant="primary">
              결과보기 {previewCount}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-(--gap-3)">
      <p className="text-caption-medium-pc text-text-secondary">{label}</p>
      <div className="flex flex-wrap gap-(--gap-2)">{children}</div>
    </div>
  );
}
