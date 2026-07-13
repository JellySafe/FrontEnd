"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RISK_LABEL } from "@/shared/risk/types";
import { getDetailedBeach } from "../mocks/detailed-map.mock";
import type { DetailedMapScreen } from "../types";
import { DetailedMapDetail } from "./DetailedMapDetail";
import { DetailedMapHeader } from "./DetailedMapHeader";
import { ResponseLog } from "./ResponseLog";

export type DetailedMapViewProps = {
  beachId?: string;
};

// 단일 라우트에서 상세 분석 뷰와 대응 기록 뷰를 union 상태로 전환한다.
export function DetailedMapView({ beachId }: DetailedMapViewProps) {
  const router = useRouter();
  const [screen, setScreen] = useState<DetailedMapScreen>("detail");
  const beach = getDetailedBeach(beachId);

  // 수행하기 클릭 시 조치 프리셋 없이 대응 기록 화면으로만 전환한다.
  const handleSelectRecommendation = () => {
    setScreen("response-log");
  };

  if (screen === "response-log") {
    return (
      <div className="flex flex-col gap-(--gap-8)">
        <DetailedMapHeader
          backLabel="상세 화면으로"
          onBack={() => setScreen("detail")}
          title="대응 기록"
        />
        <ResponseLog />
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
      <DetailedMapDetail beach={beach} onSelectRecommendation={handleSelectRecommendation} />
    </div>
  );
}
