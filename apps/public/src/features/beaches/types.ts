import type { DataConfidence } from "@/shared/api/types";
import type { MapPoint, RiskCause, RiskLevel, TimeFrame } from "@/shared/risk/types";

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

// 타임라인 한 시점(now/24h/72h). 차트 막대 + 원인 탭이 공유.
export type BeachRiskPoint = {
  timeFrame: TimeFrame;
  risk: RiskLevel;
  riskScore: number;
  confidence: DataConfidence;
  causes: RiskCause[];
};

// 상세 화면용 위험도(risk API 매핑 결과). risk*/causes는 현재 시점 편의 필드.
export type BeachRiskInfo = {
  risk: RiskLevel;
  riskScore: number;
  factors: string[];
  guideText: string;
  confidence: DataConfidence;
  // 현재 시점 위험 원인(name + detail)
  causes: RiskCause[];
  // now → 24h → 72h 순. 없는 시점은 배열에서 생략될 수 있음.
  timeline: BeachRiskPoint[];
};
