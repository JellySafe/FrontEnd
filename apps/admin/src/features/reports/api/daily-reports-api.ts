import { getJson, patchJson, postJson } from "@/shared/api/http-client";
import type {
  DailyReportResponse,
  GenerateDailyReportRequest,
  UpdateDailyReportMemoRequest,
} from "@/shared/api/types";

export function getDailyReport(
  beachId: number,
  date: string,
): Promise<DailyReportResponse> {
  const searchParams = new URLSearchParams({
    beachId: String(beachId),
    date,
  });
  return getJson<DailyReportResponse>(
    `/api/admin/daily-reports?${searchParams.toString()}`,
  );
}

export function generateDailyReport(
  body: GenerateDailyReportRequest,
): Promise<DailyReportResponse> {
  return postJson<DailyReportResponse>("/api/admin/daily-reports", body);
}

export function updateDailyReportMemo(
  reportId: number,
  body: UpdateDailyReportMemoRequest,
): Promise<DailyReportResponse> {
  return patchJson<DailyReportResponse>(
    `/api/admin/daily-reports/${reportId}/memo`,
    body,
  );
}
