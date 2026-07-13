"use client";

import { Card, Tabs } from "@jellysafe/design-system";
import { useState } from "react";
import type { RiskCause, TimeFrame } from "@/shared/risk/types";

const TAB_ITEMS = [
  { value: "current", label: "현재" },
  { value: "after24h", label: "24시간 후" },
  { value: "after72h", label: "72시간 후" },
];

// 미래 시점 예측 데이터가 아직 없을 때 안내 문구
const FUTURE_EMPTY_TEXT = "예측 데이터 준비 중입니다.";

// 현재 시점 원인만 API로 제공(factors). 미래 시점 탭은 빈 상태 안내.
export type RiskCauseSectionProps = {
  causes: RiskCause[];
};

export function RiskCauseSection({ causes }: RiskCauseSectionProps) {
  const [tab, setTab] = useState<TimeFrame>("current");
  // 접힌 원인 제목 집합. 빈 Set = 전부 펼침.
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());

  const toggle = (title: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const isCurrent = tab === "current";

  return (
    // Figma: 제목행↔카드 8px, 원인 항목 간 16px, 칩↔설명 4px, 카드 패딩 24px
    <section className="flex flex-col gap-[var(--gap-3)]">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-xsmall-mobile text-text-primary">시간별 위험 원인</h2>
        <Tabs
          aria-label="시간별 위험 원인 시점 선택"
          items={TAB_ITEMS}
          onValueChange={(value) => setTab(value as TimeFrame)}
          value={tab}
          variant="segmented"
        />
      </div>
      <Card className="p-[var(--padding-7)]" variant="surface">
        {isCurrent && causes.length > 0 ? (
          <div className="flex flex-col gap-[var(--gap-5)]">
            {causes.map((cause) => (
              <div className="flex flex-col gap-[var(--gap-2)]" key={cause.title}>
                <button
                  className="w-fit self-start rounded-lg bg-bg-default px-(--padding-2) py-(--padding-1) text-body-xsmall-mobile text-text-primary"
                  onClick={() => toggle(cause.title)}
                  type="button"
                >
                  {cause.title}
                </button>
                {/* description이 있을 때만 렌더(현재 API는 title만 제공) */}
                {cause.description && !collapsed.has(cause.title) ? (
                  <p className="text-body-xxsmall-mobile text-text-secondary">{cause.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="py-(--padding-4) text-center text-body-xsmall-mobile text-text-tertiary">
            {isCurrent ? "현재 특이사항이 없습니다." : FUTURE_EMPTY_TEXT}
          </p>
        )}
      </Card>
    </section>
  );
}
