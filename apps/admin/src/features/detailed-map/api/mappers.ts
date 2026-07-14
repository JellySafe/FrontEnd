import {
  formatCauseSummary,
  toBeachDetail,
} from "@/features/dashboard/api/mappers";
import type { BeachSummary } from "@/features/dashboard/types";
import type {
  AdminBeachRiskResponse,
  OperationActionListItemResponse,
  OperationStatus,
  RecommendationItemResponse,
  RecommendationViewResponse,
  RiskCardResponse,
  RiskFactorTagResponse,
} from "@/shared/api/types";
import {
  confidenceToPercent,
  formatDateTime,
  horizonToTimeFrame,
  toRiskLevel,
} from "@/shared/risk/mappers";
import type { RiskCause, TimeFrame } from "@/shared/risk/types";
import type {
  CauseFrameData,
  DetailedBeach,
  ResponseAction,
  ResponseLogEntry,
  ResponseRecommendation,
} from "../types";

export const RESPONSE_ACTIONS: ResponseAction[] = [
  { id: "normal", label: "정상 운영" },
  { id: "entry_caution", label: "입수 주의 안내" },
  { id: "monitoring_up", label: "모니터링 강화" },
  { id: "lifeguard_added", label: "안전요원 추가" },
  { id: "broadcast", label: "안내방송" },
  { id: "zone_control_review", label: "구역 통제 검토" },
  { id: "entry_ban", label: "입수 통제" },
  { id: "resumed", label: "운영 재개" },
];

export const OPERATION_STATUS_LABEL = RESPONSE_ACTIONS.reduce<
  Record<OperationStatus, string>
>(
  (labels, action) => {
    labels[action.id as OperationStatus] = action.label;
    return labels;
  },
  {} as Record<OperationStatus, string>,
);

export function factorsToCauses(factors: RiskFactorTagResponse[]): RiskCause[] {
  return factors.map((factor) => ({
    title: factor.name,
    description: factor.detail,
  }));
}

export function toCauseByFrame(
  cards: RiskCardResponse[],
): Record<TimeFrame, CauseFrameData> {
  const causeByFrame: Record<TimeFrame, CauseFrameData> = {
    current: { causes: [] },
    after24h: { causes: [] },
    after72h: { causes: [] },
  };

  for (const card of cards) {
    const timeFrame = horizonToTimeFrame(card.horizon);
    if (!timeFrame) continue;

    causeByFrame[timeFrame] = {
      causes: factorsToCauses(card.factors),
    };
  }

  return causeByFrame;
}

function toRecommendation(item: RecommendationItemResponse): ResponseRecommendation {
  return {
    id: String(item.recommendationId),
    risk: toRiskLevel(item.riskLevel),
    title: item.title,
    description: item.description ?? "",
  };
}

export function toRecommendations(
  response: RecommendationViewResponse,
): ResponseRecommendation[] {
  return [...response.recommendations]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(toRecommendation);
}

export function toResponseLogEntry(
  action: OperationActionListItemResponse,
): ResponseLogEntry {
  const actionLabel = OPERATION_STATUS_LABEL[action.operationStatus];
  const trimmedMemo = action.memo?.trim();

  return {
    id: String(action.actionId),
    actionLabel,
    savedAt: `${formatDateTime(action.createdAt)} 저장`,
    actionAt: formatDateTime(action.createdAt),
    manager: action.createdByName ?? "—",
    content: trimmedMemo || `${actionLabel} 조치 기록`,
    results: [],
  };
}

export function toDetailedBeach(
  risk: AdminBeachRiskResponse,
  recommendations: RecommendationViewResponse,
): DetailedBeach {
  const nowCard =
    risk.cards.find((card) => card.horizon === "now") ?? risk.cards[0];

  const summary: BeachSummary = {
    id: String(risk.beachId),
    name: risk.beachName,
    address: risk.region,
    risk: toRiskLevel(nowCard?.riskLevel ?? "safe"),
    riskScore: nowCard?.riskScore ?? 0,
    confidence: confidenceToPercent(nowCard?.confidence ?? "low"),
    causeSummary: formatCauseSummary(nowCard?.factors ?? []),
    hasUnidentifiedReport: false,
    point: { lat: 0, lng: 0 },
  };

  const detail = toBeachDetail(summary, risk);

  return {
    id: detail.id,
    name: detail.name,
    address: detail.address,
    risk: detail.risk,
    createdAt: detail.createdAt,
    collectedAt: detail.collectedAt,
    hourly: detail.hourly,
    causeByFrame: toCauseByFrame(risk.cards),
    recommendations: toRecommendations(recommendations),
  };
}
