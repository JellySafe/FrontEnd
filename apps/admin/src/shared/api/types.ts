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
  reportType: BackendReportType;
  status: BackendReportStatus;
  aiResult: BackendAiResult | null;
  aiConfidence: number | null;
  thumbnailUrl: string | null;
  submittedAt: string;
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
