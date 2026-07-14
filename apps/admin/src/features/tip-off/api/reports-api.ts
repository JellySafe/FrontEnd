import { getJson } from "@/shared/api/http-client";
import type { PaginatedResponse, ReportListItemResponse } from "@/shared/api/types";

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
