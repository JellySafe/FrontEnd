// Detailed Map(해변 상세 분석 + 대응 기록) 도메인 타입.
// 공통 위험도 타입은 shared/risk에서 재사용한다. 백엔드 DTO는 단정하지 않는다.

import type { HourlyRisk, RiskCause, RiskLevel, TimeFrame } from "@/shared/risk/types";

// 단일 화면 내부 뷰 상태
export type DetailedMapScreen = "detail" | "response-log";

// 대응 권고 항목
export type ResponseRecommendation = {
  id: string;
  risk: RiskLevel;
  title: string;
  description: string;
};

// 수행한 조치 선택지(칩)
export type ResponseAction = {
  id: string;
  label: string;
};

// 대응 기록 이력 항목
export type ResponseLogEntry = {
  id: string;
  actionLabel: string;
  savedAt: string;
  actionAt: string;
  manager: string;
  content: string;
  results: string[];
  memo?: string;
};

// 시간대별 위험 원인 데이터
export type CauseFrameData = {
  causes: RiskCause[];
};

// 상세 분석 대상 해변
export type DetailedBeach = {
  id: string;
  name: string;
  address: string;
  risk: RiskLevel;
  createdAt: string;
  collectedAt: string;
  hourly: HourlyRisk[];
  causeByFrame: Record<TimeFrame, CauseFrameData>;
  recommendations: ResponseRecommendation[];
};
