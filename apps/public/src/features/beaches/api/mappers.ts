import type {
  BackendHorizon,
  BeachDetailResponse,
  BeachListItemResponse,
  PublicBeachRiskResponse,
  PublicRiskFactorResponse,
  PublicRiskPointResponse,
} from "@/shared/api/types";
import { toRiskLevel } from "@/shared/risk/mappers";
import type { RiskCause, TimeFrame } from "@/shared/risk/types";
import type { BeachDetailInfo, BeachListItem, BeachRiskInfo, BeachRiskPoint } from "../types";

// 모든 해변 공통 placeholder 이미지(Figma 카드 사진 에셋)
const PLACEHOLDER_IMAGE = "/assets/beaches/placeholder.png";

// 목록 항목 매핑. currentRiskLevel이 null이면 안전 기본값.
export function toBeachListItem(dto: BeachListItemResponse): BeachListItem {
  return {
    id: String(dto.beachId),
    name: dto.name,
    region: dto.region,
    address: dto.region,
    risk: dto.currentRiskLevel ? toRiskLevel(dto.currentRiskLevel) : "safe",
    point: { lat: dto.lat, lng: dto.lng },
    imageSrc: PLACEHOLDER_IMAGE,
    priority: dto.priority,
  };
}

// 상세 마스터 매핑
export function toBeachDetailInfo(dto: BeachDetailResponse): BeachDetailInfo {
  return {
    id: String(dto.beachId),
    name: dto.name,
    region: dto.region,
    point: { lat: dto.lat, lng: dto.lng },
    facingDirection: dto.facingDirection,
    vulnerabilityScore: dto.vulnerabilityScore,
    isActive: dto.isActive,
  };
}

// factors 객체 -> UI용 원인(name=제목, detail=한 줄 설명)
function toCauses(factors: PublicRiskFactorResponse[]): RiskCause[] {
  return factors.map((factor) => ({
    title: factor.name,
    description: factor.detail,
  }));
}

// 백엔드 horizon -> 프론트 TimeFrame. 6h는 매핑 불가.
function toTimeFrame(horizon: BackendHorizon): TimeFrame | null {
  switch (horizon) {
    case "now":
      return "current";
    case "24h":
      return "after24h";
    case "72h":
      return "after72h";
    default:
      return null;
  }
}

function toBeachRiskPoint(dto: PublicRiskPointResponse): BeachRiskPoint | null {
  const timeFrame = toTimeFrame(dto.horizon);
  if (!timeFrame) {
    return null;
  }

  return {
    timeFrame,
    risk: toRiskLevel(dto.riskLevel),
    riskScore: dto.riskScore,
    confidence: dto.dataConfidence,
    causes: toCauses(dto.factors),
  };
}

// 상세 위험도 매핑
export function toBeachRiskInfo(dto: PublicBeachRiskResponse): BeachRiskInfo {
  const timeline = dto.riskTimeline
    .map(toBeachRiskPoint)
    .filter((point): point is BeachRiskPoint => point !== null);

  const resolvedTimeline =
    timeline.length > 0
      ? timeline
      : [
          {
            timeFrame: "current" as const,
            risk: toRiskLevel(dto.riskLevel),
            riskScore: dto.riskScore,
            confidence: dto.dataConfidence,
            causes: toCauses(dto.factors),
          },
        ];

  return {
    risk: toRiskLevel(dto.riskLevel),
    riskScore: dto.riskScore,
    factors: dto.factors.map((factor) => factor.name),
    guideText: dto.guideText,
    confidence: dto.dataConfidence,
    causes: toCauses(dto.factors),
    timeline: resolvedTimeline,
  };
}
