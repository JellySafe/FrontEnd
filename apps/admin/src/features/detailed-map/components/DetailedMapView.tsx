"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RISK_LABEL } from "@/shared/risk/types";
import { useDetailedMapData } from "../api/useDetailedMapData";
import type { DetailedMapScreen } from "../types";
import { DetailedMapDetail } from "./DetailedMapDetail";
import { DetailedMapHeader } from "./DetailedMapHeader";
import { DetailedMapLoadingSkeleton } from "./DetailedMapLoadingSkeleton";
import { ResponseLog } from "./ResponseLog";

export type DetailedMapViewProps = {
  beachId?: string;
};

// 단일 라우트에서 상세 분석 뷰와 대응 기록 뷰를 union 상태로 전환한다.
export function DetailedMapView({ beachId: beachIdParam }: DetailedMapViewProps) {
  const router = useRouter();
  const [screen, setScreen] = useState<DetailedMapScreen>("detail");
  const [pendingRecommendationId, setPendingRecommendationId] = useState<number | null>(null);

  const {
    beachId,
    beach,
    history,
    isLoading,
    isError,
    isInvalidId,
    isRefreshing,
    refresh,
    reloadHistory,
  } = useDetailedMapData(beachIdParam);

  const handleSelectRecommendation = (recommendationId: string) => {
    setPendingRecommendationId(Number(recommendationId));
    setScreen("response-log");
  };

  const handleClearPendingRecommendation = () => {
    setPendingRecommendationId(null);
  };

  if (isInvalidId) {
    return (
      <div className="flex flex-col items-center justify-center pt-(--padding-8)">
        <p className="text-body-xsmall-pc text-text-tertiary">유효하지 않은 해변 ID입니다</p>
      </div>
    );
  }

  if (screen === "response-log") {
    return (
      <div className="flex flex-col gap-(--gap-8)">
        <DetailedMapHeader
          backLabel="상세 화면으로"
          onBack={() => setScreen("detail")}
          title="대응 기록"
        />
        {beachId !== null ? (
          <ResponseLog
            beachId={beachId}
            history={history}
            onClearPendingRecommendation={handleClearPendingRecommendation}
            onHistoryReload={reloadHistory}
            pendingRecommendationId={pendingRecommendationId}
          />
        ) : null}
      </div>
    );
  }

  if (isLoading && !beach) {
    return (
      <div className="flex flex-col">
        <DetailedMapHeader
          backLabel="대시보드로"
          onBack={() => router.push("/dashboard")}
          title="해변 상세"
        />
        <DetailedMapLoadingSkeleton />
      </div>
    );
  }

  if (isError || !beach) {
    return (
      <div className="flex flex-col">
        <DetailedMapHeader
          backLabel="대시보드로"
          onBack={() => router.push("/dashboard")}
          title="해변 상세"
        />
        <div className="flex items-center justify-center pt-(--padding-8)">
          <p className="text-body-xsmall-pc text-text-tertiary">상세 정보를 불러오지 못했습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <DetailedMapHeader
        backLabel="대시보드로"
        onBack={() => router.push("/dashboard")}
        risk={beach.risk}
        riskLabel={RISK_LABEL[beach.risk]}
        title={beach.name}
      />
      <DetailedMapDetail
        beach={beach}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
        onSelectRecommendation={handleSelectRecommendation}
      />
    </div>
  );
}
