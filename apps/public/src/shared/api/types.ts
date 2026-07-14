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

// 예측 시점(백엔드 명칭). public riskTimeline은 now/24h/72h.
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

// GET /api/public/beaches/{beachId}/risk — 위험 원인 태그
export type PublicRiskFactorResponse = {
  code: string;
  name: string;
  detail: string;
  scoreDelta: number;
};

// GET /api/public/beaches/{beachId}/risk — 시점별 예측 포인트
export type PublicRiskPointResponse = {
  horizon: BackendHorizon;
  riskLevel: BackendRiskLevel;
  riskScore: number;
  factors: PublicRiskFactorResponse[];
  dataConfidence: DataConfidence;
  generatedAt: string | null;
};

// GET /api/public/beaches/{beachId}/risk
// 최상위 risk*/factors는 하위호환용 현재 시점. 타임라인은 riskTimeline(now→24h→72h).
export type PublicBeachRiskResponse = {
  beachId: number;
  beachName: string;
  horizon: BackendHorizon;
  riskLevel: BackendRiskLevel;
  riskScore: number;
  factors: PublicRiskFactorResponse[];
  guideText: string;
  dataConfidence: DataConfidence;
  generatedAt: string | null;
  riskTimeline: PublicRiskPointResponse[];
};

// 알림
export type AlertEventType = "level_up" | "toxic_report" | "sting_report";
export type AlertListItemResponse = {
  notificationId: number;
  beachId: number;
  beachName: string | null;
  // safe|caution|danger|severe|null
  riskLevel: BackendRiskLevel | null;
  eventType: AlertEventType;
  title: string | null;
  message: string;
  createdAt: string;
  // 미읽음이면 null
  readAt: string | null;
};
export type AlertListResponse = {
  items: AlertListItemResponse[];
  total: number;
  page: number;
  size: number;
};
export type AlertReadResponse = { notificationId: number; readAt: string };

// 관심
export type FavoriteCreateResponse = { favoriteId: number; beachId: number };
export type FavoriteListItemResponse = {
  favoriteId: number;
  beachId: number;
  beachName: string;
  region: string;
  currentRiskLevel: string | null;
  currentRiskScore: number | null;
  createdAt: string;
};

// 제보
export type ReportImageUploadResponse = { imageUrl: string; thumbnailUrl: string | null };
export type ReportBackendType = "general" | "multiple" | "sting";
export type ReportSubmitRequest = {
  beachId?: number;
  lat?: number;
  lng?: number;
  imageUrl: string;
  thumbnailUrl?: string;
  reportType: ReportBackendType;
  // ISO8601
  occurredAt: string;
  consentLogIds: number[];
  reporterToken?: string;
};
export type ReportSubmitResponse = { reportId: number; status: string; aiStatus: string };
export type ReportStatus =
  | "received"
  | "ai_processing"
  | "ai_done"
  | "verified"
  | "rejected"
  | "hold"
  | "reflected";
export type ReportAiResult = "normal" | "toxic_suspected" | "unknown";
export type ReportResultResponse = {
  reportId: number;
  status: ReportStatus;
  aiResult: ReportAiResult | null;
  // 0~1
  aiConfidence: number | null;
  guideMessage: string;
  adminReviewStatus: "verified" | "rejected" | "hold" | null;
};

// GET /api/public/guides
export type GuideTargetType = "public" | "admin";
export type PublicGuideResponse = {
  id: number;
  guideCode: string;
  targetType: GuideTargetType;
  riskLevel: BackendRiskLevel | null;
  title: string;
  body: string;
  displayOrder: number;
};
