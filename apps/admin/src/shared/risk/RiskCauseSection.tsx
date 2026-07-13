"use client";

import { Card, Tabs } from "@jellysafe/design-system";
import { useScrollIndicator } from "@/shared/hooks/useScrollIndicator";
import { TIME_FRAME_LABEL } from "./types";
import type { RiskCause, TimeFrame } from "./types";

const CAUSE_TABS: TimeFrame[] = ["current", "after24h", "after72h"];

export type RiskCauseSectionProps = {
  tab: TimeFrame;
  onTabChange: (tab: TimeFrame) => void;
  causes: RiskCause[];
  className?: string;
};

// 시간별 위험 원인 블록(제목 + 시간대 탭 + 원인 카드).
// 부모가 높이를 제한하면 원인 목록만 내부 스크롤된다.
export function RiskCauseSection({
  tab,
  onTabChange,
  causes,
  className,
}: RiskCauseSectionProps) {
  const listRef = useScrollIndicator<HTMLDivElement>();

  return (
    <section
      className={["flex h-full min-h-0 flex-col gap-(--gap-3)", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex shrink-0 items-center justify-between gap-(--gap-2)">
        <h3 className="text-heading-xsmall-pc text-text-primary">시간별 위험 원인</h3>
        <Tabs
          aria-label="시간대 선택"
          items={CAUSE_TABS.map((frame) => ({ value: frame, label: TIME_FRAME_LABEL[frame] }))}
          onValueChange={(value) => onTabChange(value as TimeFrame)}
          value={tab}
        />
      </div>
      <Card
        className="scrollbar-indicator flex min-h-0 flex-1 flex-col gap-(--gap-4) overflow-y-auto p-(--padding-7)"
        ref={listRef}
        variant="surface"
      >
        {causes.map((cause) => (
          <div className="flex flex-col gap-(--gap-3)" key={cause.title}>
            <span className="inline-flex w-fit items-center rounded-lg bg-bg-default px-(--padding-3) py-(--padding-2) text-body-xsmall-pc text-text-primary">
              {cause.title}
            </span>
            <p className="text-body-xxsmall-pc text-text-secondary">{cause.description}</p>
          </div>
        ))}
      </Card>
    </section>
  );
}
