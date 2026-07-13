// Dashboard 도메인 타입. 공통 위험도 타입/상수는 shared/risk에서 재사용한다.

import type { HourlyRisk, RiskLevel, TimeFrame } from "@/shared/risk/types";

export * from "@/shared/risk/types";

// 지도 좌표(GPS 위경도).
export type MapPoint = {
  lat: number;
  lng: number;
};

// 지도 마커 + 목록 항목이 공통으로 쓰는 표시 데이터
export type BeachSummary = {
  id: string;
  name: string;
  address: string;
  risk: RiskLevel;
  riskScore: number;
  confidence: number;
  causeSummary: string;
  hasUnidentifiedReport: boolean;
  point: MapPoint;
};

// 상세 패널용 확장 데이터
export type BeachDetail = BeachSummary & {
  createdAt: string;
  collectedAt: string;
  hourly: HourlyRisk[];
};

export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  delta?: string;
  deltaCaption?: string;
  status?: RiskLevel;
  statusLabel?: string;
};

// 필터 상태(표시 데이터와 분리). true=있음, false=없음, null=미선택
export type DashboardFilterState = {
  risks: RiskLevel[];
  time: TimeFrame | null;
  unidentified: boolean | null;
};

export const EMPTY_FILTER: DashboardFilterState = {
  risks: [],
  time: null,
  unidentified: null,
};

// 필터 팝오버의 시간 옵션 라벨
export const TIME_FILTER_LABEL: Record<TimeFrame, string> = {
  current: "현재",
  after24h: "24시간 기준",
  after72h: "72시간 기준",
};

export function countActiveFilters(filter: DashboardFilterState): number {
  return (
    filter.risks.length +
    (filter.time !== null ? 1 : 0) +
    (filter.unidentified !== null ? 1 : 0)
  );
}
