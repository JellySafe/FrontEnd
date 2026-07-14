import type { DashboardSummaryResponse, LatestRiskResponse } from "@/shared/api/types";
import {
  confidenceToPercent,
  formatGeneratedAt,
  formatSignedDelta,
  toRiskLevel,
} from "@/shared/risk/mappers";
import { RISK_LABEL } from "@/shared/risk/types";
import type { BeachSummary, DashboardStat } from "../types";

export function toDashboardStats(summary: DashboardSummaryResponse): {
  stats: DashboardStat[];
  timestamp: string;
} {
  const overallRisk = toRiskLevel(summary.overallRisk);
  const { deltas } = summary;

  return {
    timestamp: formatGeneratedAt(summary.generatedAt),
    stats: [
      {
        id: "total-risk",
        label: "전체 위험도",
        value: String(summary.overallScore),
        delta: formatSignedDelta(deltas.overallScore),
        deltaCaption: "어제보다",
        status: overallRisk,
        statusLabel: RISK_LABEL[overallRisk],
      },
      {
        id: "danger-beaches",
        label: "위험 이상 해변 수",
        value: String(summary.dangerBeachCount),
        delta: formatSignedDelta(deltas.dangerBeachCount),
        deltaCaption: "어제보다",
      },
      {
        id: "toxic-reports",
        label: "독성 의심 제보 수",
        value: String(summary.toxicPendingCount),
        delta: formatSignedDelta(deltas.toxicPendingCount),
        deltaCaption: "어제보다",
      },
      {
        id: "unidentified-reports",
        label: "미확인 제보 수",
        value: String(summary.unreviewedReportCount),
        delta: formatSignedDelta(deltas.unreviewedReportCount),
        deltaCaption: "어제보다",
      },
      {
        id: "response-records",
        label: "대응 기록 수",
        value: String(summary.actionCount),
        delta: formatSignedDelta(deltas.actionCount),
        deltaCaption: "어제보다",
      },
    ],
  };
}

export function toBeachSummary(item: LatestRiskResponse): BeachSummary {
  return {
    id: String(item.beachId),
    name: item.name,
    address: item.region,
    risk: toRiskLevel(item.riskLevel),
    riskScore: item.riskScore,
    confidence: confidenceToPercent(item.confidence),
    causeSummary: "정보 없음",
    // API에 미확인 제보 여부 필드가 없어 클라이언트 필터는 항상 false로 처리한다.
    hasUnidentifiedReport: false,
    point: { lat: item.lat, lng: item.lng },
  };
}
