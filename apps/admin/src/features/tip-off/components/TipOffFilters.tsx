"use client";

import { Button, Chip } from "@jellysafe/design-system";
import { useEffect, useRef, type ReactNode } from "react";
import { RISK_LABEL, RISK_ORDER } from "@/shared/risk/types";
import { FilterIcon } from "@/shared/ui/icons";
import {
  AI_VERDICT_LABEL,
  REPORT_TYPE_LABEL,
  type AdminStatus,
  type AiVerdict,
  type TipOffFilterState,
  type TipOffReportType,
} from "../types";
import type { RiskLevel } from "@/shared/risk/types";

const REPORT_TYPE_OPTIONS: TipOffReportType[] = [
  "mass-sighting",
  "sting-incident",
  "sighting",
];

const AI_VERDICT_OPTIONS: AiVerdict[] = ["normal", "toxic_suspected", "unknown"];

const ADMIN_STATUS_FILTER_OPTIONS: Array<{ value: AdminStatus; label: string }> = [
  { value: "unreviewed", label: "미확인" },
  { value: "pending", label: "관리자 보류" },
  { value: "rejected", label: "반려" },
  { value: "approved", label: "확인완료" },
];

export type TipOffFiltersProps = {
  isOpen: boolean;
  draft: TipOffFilterState;
  appliedCount: number;
  previewCount: number;
  canReset: boolean;
  onToggle: () => void;
  onToggleRisk: (risk: RiskLevel) => void;
  onToggleReportType: (reportType: TipOffReportType) => void;
  onToggleAiVerdict: (aiVerdict: AiVerdict) => void;
  onToggleAdminStatus: (adminStatus: AdminStatus) => void;
  onReset: () => void;
  onApply: () => void;
};

export function TipOffFilters({
  isOpen,
  draft,
  appliedCount,
  previewCount,
  canReset,
  onToggle,
  onToggleRisk,
  onToggleReportType,
  onToggleAiVerdict,
  onToggleAdminStatus,
  onReset,
  onApply,
}: TipOffFiltersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const formattedCount = previewCount > 99 ? "99+" : String(previewCount);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        onToggle();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, onToggle]);

  return (
    <div
      className="relative flex flex-col items-end gap-(--gap-3)"
      ref={containerRef}
    >
      <button
        aria-expanded={isOpen}
        aria-label="필터 설정"
        className="flex items-center gap-(--gap-2) rounded-lg bg-bg-default p-(--padding-3) text-icon-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
        onClick={onToggle}
        type="button"
      >
        <FilterIcon className="size-[24px]" />
        {appliedCount > 0 ? (
          <span className="text-body-xsmall-pc text-text-primary">
            {appliedCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        // Figma drowdown: 272×432, pad 16, 본문 240. 칩 줄바꿈은 디자인 고정.
        <div className="absolute top-[calc(100%+8px)] right-0 z-30 flex w-[272px] flex-col gap-(--gap-5) rounded-lg border border-border-default bg-bg-default p-(--padding-5) shadow-[0_0_4px_var(--color-alpha-black-5)]">
          <div className="flex w-[240px] flex-col gap-(--gap-5)">
            <FilterGroup label="위험도">
              <ChipRow>
                {RISK_ORDER.map((risk) => (
                  <Chip
                    key={risk}
                    onSelectedChange={() => onToggleRisk(risk)}
                    selected={draft.risks.includes(risk)}
                  >
                    {RISK_LABEL[risk]}
                  </Chip>
                ))}
              </ChipRow>
            </FilterGroup>

            <FilterGroup label="제보 유형">
              <ChipRow>
                {REPORT_TYPE_OPTIONS.map((reportType) => (
                  <Chip
                    key={reportType}
                    onSelectedChange={() => onToggleReportType(reportType)}
                    selected={draft.reportTypes.includes(reportType)}
                  >
                    {REPORT_TYPE_LABEL[reportType]}
                  </Chip>
                ))}
              </ChipRow>
            </FilterGroup>

            <FilterGroup label="AI 판별 결과">
              <ChipRow>
                {AI_VERDICT_OPTIONS.map((aiVerdict) => (
                  <Chip
                    key={aiVerdict}
                    onSelectedChange={() => onToggleAiVerdict(aiVerdict)}
                    selected={draft.aiVerdicts.includes(aiVerdict)}
                  >
                    {AI_VERDICT_LABEL[aiVerdict]}
                  </Chip>
                ))}
              </ChipRow>
            </FilterGroup>

            <FilterGroup label="관리자 확인 상태">
              <ChipRow>
                {ADMIN_STATUS_FILTER_OPTIONS.slice(0, 3).map(
                  ({ value, label }) => (
                    <Chip
                      key={value}
                      onSelectedChange={() => onToggleAdminStatus(value)}
                      selected={draft.adminStatuses.includes(value)}
                    >
                      {label}
                    </Chip>
                  ),
                )}
              </ChipRow>
              <ChipRow>
                {ADMIN_STATUS_FILTER_OPTIONS.slice(3).map(({ value, label }) => (
                  <Chip
                    key={value}
                    onSelectedChange={() => onToggleAdminStatus(value)}
                    selected={draft.adminStatuses.includes(value)}
                  >
                    {label}
                  </Chip>
                ))}
              </ChipRow>
            </FilterGroup>
          </div>

          <div className="flex w-[240px] gap-(--gap-3)">
            <Button
              className="min-w-0 flex-1"
              disabled={!canReset}
              onClick={onReset}
              size="medium"
              variant="secondary"
            >
              초기화
            </Button>
            <Button
              className="min-w-0 flex-1"
              onClick={onApply}
              size="medium"
              variant="primary"
            >
              결과보기 {formattedCount}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-(--gap-2)">
      <p className="text-caption-medium-pc text-text-tertiary">{label}</p>
      <div className="flex flex-col gap-(--gap-2)">{children}</div>
    </div>
  );
}

function ChipRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-nowrap items-start gap-(--gap-2)">
      {children}
    </div>
  );
}
