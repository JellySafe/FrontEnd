import type {
  BackendRiskLevel,
  BeachDetailResponse,
  BeachListItemResponse,
  PublicBeachRiskResponse,
} from "@/shared/api/types";
import type { RiskCause, RiskLevel } from "@/shared/risk/types";
import type { BeachDetailInfo, BeachListItem, BeachRiskInfo } from "../types";

// 모든 해변 공통 placeholder 이미지(Figma 카드 사진 에셋)
const PLACEHOLDER_IMAGE = "/assets/beaches/placeholder.png";

// 백엔드 severe -> 프론트 critical. 그 외 등급은 명칭 동일.
export function toRiskLevel(level: BackendRiskLevel): RiskLevel {
  return level === "severe" ? "critical" : level;
}

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

// factors(문자열 배열) -> 현재 시점 원인. description은 없으므로 빈 문자열.
function toCauses(factors: string[]): RiskCause[] {
  return factors.map((factor) => ({ title: factor, description: "" }));
}

// 상세 위험도 매핑
export function toBeachRiskInfo(dto: PublicBeachRiskResponse): BeachRiskInfo {
  return {
    risk: toRiskLevel(dto.riskLevel),
    riskScore: dto.riskScore,
    factors: dto.factors,
    guideText: dto.guideText,
    confidence: dto.dataConfidence,
    causes: toCauses(dto.factors),
  };
}
