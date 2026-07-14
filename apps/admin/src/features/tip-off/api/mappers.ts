import type {
  BackendReportStatus,
  BackendReportType,
  LatestRiskResponse,
  ReportListItemResponse,
} from "@/shared/api/types";
import { formatDateTime, toRiskLevel } from "@/shared/risk/mappers";
import type { RiskLevel } from "@/shared/risk/types";
import type {
  AdminStatus,
  ThumbnailState,
  TipOffListItem,
  TipOffReportType,
} from "../types";

export function buildRiskByBeachId(items: LatestRiskResponse[]): Map<number, RiskLevel> {
  return new Map(items.map((item) => [item.beachId, toRiskLevel(item.riskLevel)]));
}

export function resolveMediaUrl(url: string | null): { state: ThumbnailState; src?: string } {
  if (!url) {
    return { state: "empty" };
  }
  if (url.startsWith("http")) {
    return { state: "loaded", src: url };
  }
  if (url.startsWith("/")) {
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";
    return { state: "loaded", src: `${base}${url}` };
  }
  return { state: "loaded", src: url };
}

function mapReportType(type: BackendReportType): TipOffReportType {
  switch (type) {
    case "general":
      return "sighting";
    case "multiple":
      return "mass-sighting";
    case "sting":
      return "sting-incident";
  }
}

function mapAdminStatus(status: BackendReportStatus): AdminStatus {
  switch (status) {
    case "ai_done":
    case "received":
    case "ai_processing":
      return "unreviewed";
    case "verified":
    case "reflected":
      return "approved";
    case "hold":
      return "pending";
    case "rejected":
      return "rejected";
  }
}

export function toTipOffListItem(
  item: ReportListItemResponse,
  riskByBeachId: Map<number, RiskLevel>,
): TipOffListItem {
  const thumbnail = resolveMediaUrl(item.thumbnailUrl);

  return {
    id: String(item.reportId),
    title: item.beachName || `제보 #${item.reportId}`,
    beach: item.beachName ?? "",
    address: "",
    receivedAt: formatDateTime(item.submittedAt),
    receivedAtSort: Date.parse(item.submittedAt),
    risk: item.beachId ? (riskByBeachId.get(item.beachId) ?? "safe") : "safe",
    reportType: mapReportType(item.reportType),
    aiVerdict: item.aiResult ?? "unknown",
    confidence: Math.round((item.aiConfidence ?? 0) * 100),
    adminStatus: mapAdminStatus(item.status),
    thumbnailState: thumbnail.state,
    thumbnailSrc: thumbnail.src,
  };
}
