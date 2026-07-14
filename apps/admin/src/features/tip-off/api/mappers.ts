import type {
  BackendRejectReason,
  BackendReportStatus,
  BackendReportType,
  BackendReviewStatus,
  LatestRiskResponse,
  ReportListItemResponse,
  ReviewReportRequest,
} from "@/shared/api/types";
import { formatDateTime, toRiskLevel } from "@/shared/risk/mappers";
import type { RiskLevel } from "@/shared/risk/types";
import type {
  AdminStatus,
  RejectReason,
  ReviewDecision,
  ThumbnailState,
  TipOffListItem,
  TipOffReportType,
} from "../types";

export function buildRiskByBeachId(items: LatestRiskResponse[]): Map<number, RiskLevel> {
  return new Map(items.map((item) => [item.beachId, toRiskLevel(item.riskLevel)]));
}

export const TIP_OFF_THUMB_PLACEHOLDER = "/assets/tip-off/thumbnail-placeholder.png";

export function resolveMediaUrl(url: string | null): { state: ThumbnailState; src?: string } {
  if (!url) return { state: "empty" };

  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsed = new URL(url);
      // 백엔드 데모 플레이스홀더(실파일 없음) → 로컬 에셋
      if (parsed.hostname === "demo.jellysafe.local") {
        return { state: "loaded", src: TIP_OFF_THUMB_PLACEHOLDER };
      }
      if (parsed.pathname.startsWith("/uploads/")) {
        return { state: "loaded", src: parsed.pathname };
      }
      return { state: "loaded", src: url };
    } catch {
      return { state: "empty" };
    }
  }

  if (url.startsWith("/")) {
    // same-origin (rewrites). Do NOT prefix NEXT_PUBLIC_API_URL — that creates
    // absolute host requiring remotePatterns and bypasses next rewrites.
    return { state: "loaded", src: url };
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

export function mapAdminStatus(status: BackendReportStatus): AdminStatus {
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

function mapRejectReason(reason: Exclude<RejectReason, null>): BackendRejectReason {
  switch (reason) {
    case "not-jellyfish":
      return "not_jellyfish";
    case "unclear-photo":
      return "unclear";
    case "duplicate":
      return "duplicate";
    case "location-error":
      return "wrong_location";
  }
}

function mapReviewStatus(decision: Exclude<ReviewDecision, null>): BackendReviewStatus {
  switch (decision) {
    case "approved":
      return "verified";
    case "pending":
      return "hold";
    case "rejected":
      return "rejected";
  }
}

export function toReviewRequest(
  decision: Exclude<ReviewDecision, null>,
  rejectReason: RejectReason,
): ReviewReportRequest {
  const reviewStatus = mapReviewStatus(decision);

  if (decision === "rejected" && rejectReason) {
    return {
      reviewStatus,
      rejectReason: mapRejectReason(rejectReason),
    };
  }

  return { reviewStatus };
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
    reportStatus: item.status,
    thumbnailState: thumbnail.state,
    thumbnailSrc: thumbnail.src,
  };
}
