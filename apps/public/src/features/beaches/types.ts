import type { DataConfidence } from "@/shared/api/types";
import type { MapPoint, RiskCause, RiskLevel } from "@/shared/risk/types";

// 목록/카드용 해변 요약 도메인 모델.
// 숫자 beachId를 문자열 id로 담아 기존 Likes/정렬/PlaceCard/라우팅과 그대로 호환.
export type BeachListItem = {
  id: string;
  name: string;
  region: string;
  // PlaceCard/AlternativeBeaches의 address 자리에 region을 노출
  address: string;
  risk: RiskLevel;
  point: MapPoint;
  imageSrc: string;
  priority: number;
};

// 상세 화면용 마스터 정보(detail API 매핑 결과)
export type BeachDetailInfo = {
  id: string;
  name: string;
  region: string;
  point: MapPoint;
  facingDirection: number | null;
  vulnerabilityScore: number;
  isActive: boolean;
};

// 상세 화면용 현재 시점 위험도(risk API 매핑 결과)
export type BeachRiskInfo = {
  risk: RiskLevel;
  riskScore: number;
  factors: string[];
  guideText: string;
  confidence: DataConfidence;
  // 현재 시점 위험 원인(factors -> title만 채운 RiskCause)
  causes: RiskCause[];
};
