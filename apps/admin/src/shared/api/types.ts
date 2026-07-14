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
