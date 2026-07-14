import { getJson } from "@/shared/api/http-client";
import type { BackendHorizon, DashboardSummaryResponse, LatestRiskResponse } from "@/shared/api/types";

export function getDashboardSummary(): Promise<DashboardSummaryResponse> {
  return getJson<DashboardSummaryResponse>("/api/admin/dashboard/summary");
}

export function getLatestRisks(horizon: BackendHorizon): Promise<LatestRiskResponse[]> {
  const params = new URLSearchParams({ horizon });
  return getJson<LatestRiskResponse[]>(`/api/admin/risks/latest?${params.toString()}`);
}
