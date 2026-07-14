export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

export type ApiErrorBody = {
  success: false;
  error: { code: string; message: string | string[] };
};

export type AdminRole = "public" | "operator" | "admin";

export type LoginUserRequest = {
  email: string;
  password: string;
};

export type LoginUserResponse = {
  userId: number;
  email: string;
  role: AdminRole;
  name: string;
  lastLoginAt: string | null;
  accessToken: string;
};

export type BackendRiskLevel = "safe" | "caution" | "danger" | "severe";
export type DataConfidence = "high" | "medium" | "low";
export type BackendHorizon = "now" | "6h" | "24h" | "72h";

export type DashboardDeltasResponse = {
  overallScore: number;
  dangerBeachCount: number;
  toxicPendingCount: number;
  unreviewedReportCount: number;
  actionCount: number;
};

export type DashboardSummaryResponse = {
  overallRisk: BackendRiskLevel;
  overallScore: number;
  dangerBeachCount: number;
  toxicPendingCount: number;
  unreviewedReportCount: number;
  actionCount: number;
  generatedAt: string | null;
  deltas: DashboardDeltasResponse;
};

export type LatestRiskResponse = {
  beachId: number;
  name: string;
  region: string;
  lat: number;
  lng: number;
  riskLevel: BackendRiskLevel;
  riskScore: number;
  confidence: DataConfidence;
  horizon: BackendHorizon;
  minLevelApplied: boolean;
  generatedAt: string;
};

export type RiskFactorTagResponse = {
  code: string;
  name: string;
  detail: string;
  delta: number;
  sourceReportId: number | null;
};

export type RiskCardResponse = {
  horizon: BackendHorizon;
  riskLevel: BackendRiskLevel;
  riskScore: number;
  confidence: DataConfidence;
  generatedAt: string;
  factors: RiskFactorTagResponse[];
};

export type AdminBeachRiskResponse = {
  beachId: number;
  beachName: string;
  region: string;
  cards: RiskCardResponse[];
};

export type OperationStatus =
  | "normal"
  | "monitoring_up"
  | "entry_caution"
  | "lifeguard_added"
  | "broadcast"
  | "zone_control_review"
  | "entry_ban"
  | "resumed";

export type OperationStatusResponse = {
  beachId: number;
  operationStatus: OperationStatus;
  actionType: string | null;
  createdBy: number;
  createdByName: string | null;
  createdAt: string;
};

export type OperationActionListItemResponse = {
  actionId: number;
  beachId: number;
  operationStatus: OperationStatus;
  actionType: string | null;
  memo: string | null;
  riskScoreId: number | null;
  recommendationId: number | null;
  createdBy: number;
  createdByName: string | null;
  createdAt: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
};

export type RecommendationItemResponse = {
  recommendationId: number;
  actionCode: string;
  riskLevel: BackendRiskLevel;
  title: string;
  description: string | null;
  displayOrder: number;
};

export type RecommendationViewResponse = {
  beachId: number;
  currentRiskLevel: BackendRiskLevel | null;
  recommendations: RecommendationItemResponse[];
};

export type RecordOperationActionRequest = {
  beachId: number;
  operationStatus: OperationStatus;
  actionType?: string;
  memo?: string;
  riskScoreId?: number;
  recommendationId?: number;
};

export type RecordOperationActionResponse = {
  actionId: number;
  beachId: number;
  operationStatus: OperationStatus;
  previousStatus: string | null;
  createdBy: number;
  createdAt: string;
};

export type BackendReportType = "general" | "multiple" | "sting";
export type BackendReportStatus =
  | "received"
  | "ai_processing"
  | "ai_done"
  | "verified"
  | "rejected"
  | "hold"
  | "reflected";
export type BackendAiResult = "normal" | "toxic_suspected" | "unknown";

export type ReportListItemResponse = {
  reportId: number;
  beachId: number | null;
  beachName: string | null;
  // 배정된 해변 좌표(beachId가 null이면 null)
  beachLat: number | null;
  beachLng: number | null;
  // 제보 좌표(90일 보관 만료 시 null)
  lat: number | null;
  lng: number | null;
  // 해변 미배정 제보의 위치 맥락(beachId가 null일 때만 채워짐)
  nearestBeachId: number | null;
  nearestBeachName: string | null;
  nearestBeachDistanceKm: number | null;
  reportType: BackendReportType;
  status: BackendReportStatus;
  aiResult: BackendAiResult | null;
  aiConfidence: number | null;
  // 제보 사진 원본 URL(파기된 제보는 null)
  imageUrl: string | null;
  // 썸네일 URL(현재 미생성이라 사실상 null → imageUrl로 폴백)
  thumbnailUrl: string | null;
  submittedAt: string;
};

export type ReportDetailResponse = ReportListItemResponse & {
  // 사용자가 목격했다고 고른 실제 시각(접수 시각과 다름)
  occurredAt: string;
  // 위험도 산출 반영 시각(확인완료 후 재산출 성공 시 채워짐)
  reflectedAt: string | null;
  // 중복 후보로 연결된 제보 id
  duplicateOfReportId: number | null;
};

export type BackendReviewStatus = "verified" | "rejected" | "hold";

export type BackendRejectReason =
  | "not_jellyfish"
  | "unclear"
  | "duplicate"
  | "wrong_location"
  | "inappropriate";

export type ReviewReportRequest = {
  reviewStatus: BackendReviewStatus;
  rejectReason?: BackendRejectReason;
};

export type ReviewReportResponse = {
  reportId: number;
  reviewStatus: BackendReviewStatus;
  reportStatus: BackendReportStatus;
  reflectedRisk: boolean;
};

export type NotificationTargetType = "admin" | "operator" | "public";
export type NotificationEventType = "level_up" | "toxic_report" | "sting_report";

export type AdminNotificationListItemResponse = {
  notificationId: number;
  targetType: NotificationTargetType;
  beachId: number;
  beachName: string | null;
  riskLevel: BackendRiskLevel | null;
  eventType: NotificationEventType;
  title: string | null;
  message: string;
  createdAt: string;
  readAt: string | null;
};

export type SendNotificationRequest = {
  targetType: NotificationTargetType;
  beachId: number;
  eventType?: NotificationEventType;
  riskLevel?: BackendRiskLevel;
  title?: string;
  message?: string;
};

export type SendNotificationResponse = {
  created: boolean;
  notificationId: number | null;
  recipientCount?: number;
};

export type AdminBeachItemResponse = {
  beachId: number;
  name: string;
  region: string;
  lat: number;
  lng: number;
  facingDirection?: number | null;
  priority?: number;
  vulnerabilityScore?: number;
  isActive?: boolean;
};

export type DailyReportResponse = {
  reportId: number | null;
  beachId: number;
  reportDate: string;
  maxRiskLevel: BackendRiskLevel | null;
  riskChangeSummary: string | null;
  reportCount: number;
  toxicCount: number;
  stingCount: number;
  actionCount: number;
  memo: string | null;
  summaryJson: unknown | null;
  persisted: boolean;
};

export type GenerateDailyReportRequest = {
  date: string;
  beachId: number;
};

export type UpdateDailyReportMemoRequest = {
  memo: string | null;
};
