// 백엔드 원본 DTO. 백엔드 명칭을 그대로 유지하고, 프론트 도메인 변환은 매퍼에서 수행.

// 공통 응답 봉투
export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

// 백엔드 위험 등급(프론트 critical 대신 severe 사용)
export type BackendRiskLevel = "safe" | "caution" | "danger" | "severe";

// 데이터 신뢰도
export type DataConfidence = "high" | "medium" | "low";

// 예측 시점(백엔드 명칭)
export type BackendHorizon = "now" | "6h" | "24h" | "72h";

// GET /api/public/beaches
export type BeachListItemResponse = {
  beachId: number;
  name: string;
  region: string;
  lat: number;
  lng: number;
  // 값이 없으면 null(안전 기본값으로 매핑)
  currentRiskLevel: BackendRiskLevel | null;
  priority: number;
};

// GET /api/public/beaches/{beachId}
export type BeachDetailResponse = {
  beachId: number;
  name: string;
  region: string;
  lat: number;
  lng: number;
  facingDirection: number | null;
  priority: number;
  vulnerabilityScore: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// GET /api/public/beaches/{beachId}/risk (현재 시점만 반환)
export type PublicBeachRiskResponse = {
  beachId: number;
  beachName: string;
  horizon: BackendHorizon;
  riskLevel: BackendRiskLevel;
  riskScore: number;
  factors: string[];
  guideText: string;
  dataConfidence: DataConfidence;
  generatedAt: string | null;
};
