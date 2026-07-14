import { getJson, patchJson } from "@/shared/api/http-client";
import type {
  PaginatedResponse,
  ReportListItemResponse,
  ReviewReportRequest,
  ReviewReportResponse,
} from "@/shared/api/types";

export type GetAdminReportsParams = { page?: number; size?: number };

export function getAdminReports(
  params?: GetAdminReportsParams,
): Promise<PaginatedResponse<ReportListItemResponse>> {
  const searchParams = new URLSearchParams({
    page: String(params?.page ?? 1),
    size: String(params?.size ?? 50),
  });
  return getJson<PaginatedResponse<ReportListItemResponse>>(
    `/api/admin/reports?${searchParams.toString()}`,
  );
}

export function reviewReport(
  reportId: number,
  body: ReviewReportRequest,
): Promise<ReviewReportResponse> {
  return patchJson<ReviewReportResponse>(`/api/admin/reports/${reportId}/review`, body);
}
