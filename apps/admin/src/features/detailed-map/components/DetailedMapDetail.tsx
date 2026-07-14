"use client";

import { Badge } from "@jellysafe/design-system";
import { useState } from "react";
import { RiskCauseSection } from "@/shared/risk/RiskCauseSection";
import { RiskPredictionChart } from "@/shared/risk/RiskPredictionChart";
import { RISK_LABEL } from "@/shared/risk/types";
import type { TimeFrame } from "@/shared/risk/types";
import { ChevronRightIcon, RefreshIcon } from "@/shared/ui/icons";
import type { DetailedBeach } from "../types";

export type DetailedMapDetailProps = {
  beach: DetailedBeach;
  onSelectRecommendation: (recommendationId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

// 상세 분석 뷰: 메타 정보 + 시간별 위험도 예측 차트 + 시간별 위험 원인 + 대응 권고.
export function DetailedMapDetail({
  beach,
  onSelectRecommendation,
  onRefresh,
  isRefreshing = false,
}: DetailedMapDetailProps) {
  const [causeTab, setCauseTab] = useState<TimeFrame>("current");
  const frame = beach.causeByFrame[causeTab];

  return (
    <div className="flex flex-col gap-(--gap-8) pb-(--padding-10)">
      <div className="flex flex-wrap items-center gap-(--gap-3) text-caption-small-pc text-text-tertiary">
        <span>{beach.address}</span>
        <span className="h-[20px] w-px bg-border-default" />
        <span className="flex gap-(--gap-2)">
          <span>예측 생성</span>
          <span>{beach.createdAt}</span>
        </span>
        <span className="h-[20px] w-px bg-border-default" />
        <span className="flex gap-(--gap-2)">
          <span>데이터 수집</span>
          <span>{beach.collectedAt}</span>
        </span>
        <button
          aria-label="새로고침"
          className="text-icon-tertiary disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isRefreshing || !onRefresh}
          onClick={onRefresh}
          type="button"
        >
          <RefreshIcon
            className={[
              "size-[20px]",
              isRefreshing ? "animate-spin" : "",
            ].join(" ")}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-(--gap-7) lg:grid-cols-2">
        <section className="flex flex-col gap-(--gap-3)">
          <h2 className="text-heading-xsmall-pc text-text-primary">시간별 위험도 예측</h2>
          <RiskPredictionChart hourly={beach.hourly} maxBarHeight={200} />
        </section>
        {/* lg+: 왼쪽 차트 높이에 맞추고, 넘치는 원인 목록은 내부 스크롤 */}
        <div className="min-h-0 lg:relative">
          <RiskCauseSection
            causes={frame.causes}
            className="lg:absolute lg:inset-0"
            onTabChange={setCauseTab}
            tab={causeTab}
          />
        </div>
      </div>

      <section className="flex flex-col gap-(--gap-4)">
        <h2 className="text-heading-xsmall-pc text-text-primary">대응 권고</h2>
        <ul className="flex flex-col">
          {beach.recommendations.map((rec, index) => (
            <li
              className={index > 0 ? "border-t border-border-default" : undefined}
              key={rec.id}
            >
              <button
                className="flex w-full flex-col gap-(--gap-3) p-(--padding-7) text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
                onClick={() => onSelectRecommendation(rec.id)}
                type="button"
              >
                <div className="flex w-full items-center gap-(--gap-3)">
                  <Badge status={rec.risk}>{RISK_LABEL[rec.risk]}</Badge>
                  <span className="min-w-0 flex-1 truncate text-body-small-pc text-text-primary">
                    {rec.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-(--gap-1) text-caption-medium-pc text-text-secondary">
                    수행하기
                    <ChevronRightIcon className="size-[24px] text-icon-secondary" />
                  </span>
                </div>
                <p className="text-caption-medium-pc text-text-tertiary">{rec.description}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
