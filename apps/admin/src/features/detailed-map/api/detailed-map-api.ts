import { getAdminBeachRisk } from "@/features/dashboard/api/dashboard-api";
import { getJson, postJson } from "@/shared/api/http-client";
import type {
  OperationActionListItemResponse,
  PaginatedResponse,
  RecommendationViewResponse,
  RecordOperationActionRequest,
  RecordOperationActionResponse,
} from "@/shared/api/types";

export { getAdminBeachRisk };

export function getBeachRecommendations(beachId: number): Promise<RecommendationViewResponse> {
  return getJson<RecommendationViewResponse>(`/api/admin/beaches/${beachId}/recommendations`);
}

export function getBeachOperationActions(
  beachId: number,
  page = 1,
  size = 50,
): Promise<PaginatedResponse<OperationActionListItemResponse>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return getJson<PaginatedResponse<OperationActionListItemResponse>>(
    `/api/admin/beaches/${beachId}/operation-actions?${params.toString()}`,
  );
}

export function recordOperationAction(
  body: RecordOperationActionRequest,
): Promise<RecordOperationActionResponse> {
  return postJson<RecordOperationActionResponse>("/api/admin/operation-actions", body);
}
