"use client";

import { useMemo } from "react";
import { ApiError } from "@/shared/api/http-client";
import type { RiskCause, TimeFrame } from "@/shared/risk/types";
import { PUBLIC_APP_MAX_WIDTH_CLASS } from "@/shared/ui/public-layout";
import { useBeachDetailQuery } from "../api/useBeachDetailQuery";
import { useBeachesQuery } from "../api/useBeachesQuery";
import { useBeachRiskQuery } from "../api/useBeachRiskQuery";
import { pickAlternativeBeaches } from "../utils/pick-alternative-beaches";
import { AlternativeBeaches } from "./AlternativeBeaches";
import { BeachDetailSkeleton } from "./BeachDetailSkeleton";
import { BeachDetailHeader } from "./BeachDetailHeader";
import { EmergencyGuide } from "./EmergencyGuide";
import { RiskCauseSection } from "./RiskCauseSection";
import { RiskGuideBanner } from "./RiskGuideBanner";
import { RiskPredictionChart } from "./RiskPredictionChart";

// 상태 안내를 담는 최소 래퍼(로딩/에러/미존재 공용)
function DetailMessage({ children }: { children: React.ReactNode }) {
  return (
    <main className={`${PUBLIC_APP_MAX_WIDTH_CLASS} bg-bg-default`}>
      <p className="px-(--padding-5) py-(--padding-10) text-center text-body-xsmall-mobile text-text-tertiary">
        {children}
      </p>
    </main>
  );
}

export type BeachDetailScreenProps = { beachId: number };

export function BeachDetailScreen({ beachId }: BeachDetailScreenProps) {
  const detailQuery = useBeachDetailQuery(beachId);
  const riskQuery = useBeachRiskQuery(beachId);
  const beachesQuery = useBeachesQuery();

  const detail = detailQuery.data;
  const risk = riskQuery.data;

  // 대체 해변: 목록에서 현재 해변 기준으로 파생(목록/상세 로드 후에만 계산)
  const alternatives = useMemo(() => {
    if (!beachesQuery.data || !detail) {
      return [];
    }
    const current = beachesQuery.data.find((beach) => beach.id === detail.id);
    if (!current) {
      return [];
    }
    return pickAlternativeBeaches(beachesQuery.data, current);
  }, [beachesQuery.data, detail]);

  const causesByFrame = useMemo(() => {
    if (!risk) {
      return {} as Record<TimeFrame, RiskCause[]>;
    }

    return Object.fromEntries(
      risk.timeline.map((point) => [point.timeFrame, point.causes]),
    ) as Record<TimeFrame, RiskCause[]>;
  }, [risk]);

  if (detailQuery.isLoading || riskQuery.isLoading) {
    return <BeachDetailSkeleton />;
  }

  // 상세 조회 404는 존재하지 않는 해변으로 안내
  if (detailQuery.error instanceof ApiError && detailQuery.error.status === 404) {
    return <DetailMessage>해변을 찾을 수 없습니다</DetailMessage>;
  }

  if (detailQuery.isError || riskQuery.isError || !detail || !risk) {
    return <DetailMessage>해변 정보를 불러오지 못했습니다</DetailMessage>;
  }

  return (
    // Figma beaches/focused: 헤더↔본문 20px, 섹션 간 24px, 제목↔내용 8px
    <main className={`${PUBLIC_APP_MAX_WIDTH_CLASS} bg-bg-default pb-[var(--padding-8)]`}>
      <BeachDetailHeader beachId={detail.id} name={detail.name} risk={risk.risk} />
      <div className="flex flex-col gap-[var(--gap-7)] px-[var(--padding-5)] pt-[var(--gap-6)]">
        <RiskGuideBanner guideText={risk.guideText} risk={risk.risk} />
        <section className="flex flex-col gap-[var(--gap-3)]">
          <h2 className="text-heading-xsmall-mobile text-text-primary">시간별 위험도 예측</h2>
          <RiskPredictionChart timeline={risk.timeline} />
        </section>
        <RiskCauseSection causesByFrame={causesByFrame} />
        <EmergencyGuide />
        <AlternativeBeaches beaches={alternatives} />
      </div>
    </main>
  );
}
