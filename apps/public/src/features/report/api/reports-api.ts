import { getJson, postJson } from "@/shared/api/http-client";
import type {
  ReportImageUploadResponse,
  ReportResultResponse,
  ReportSubmitRequest,
  ReportSubmitResponse,
} from "@/shared/api/types";

// 제보 이미지 업로드. multipart 필드명은 백엔드 계약상 "image".
export async function uploadReportImage(file: File): Promise<ReportImageUploadResponse> {
  const formData = new FormData();
  formData.append("image", file);
  return postJson<ReportImageUploadResponse>("/api/public/reports/image", formData);
}

// 제보 제출(JSON).
export async function submitReport(req: ReportSubmitRequest): Promise<ReportSubmitResponse> {
  return postJson<ReportSubmitResponse>("/api/public/reports", req);
}

// 제보 처리 결과 조회(폴링용).
export async function getReportResult(reportId: number): Promise<ReportResultResponse> {
  return getJson<ReportResultResponse>(`/api/public/reports/${reportId}`);
}
