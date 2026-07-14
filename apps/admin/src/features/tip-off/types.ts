import type { MapPoint } from "@/features/dashboard/types";
import type { BackendReportStatus } from "@/shared/api/types";
import type { RiskLevel } from "@/shared/risk/types";

export type TipOffScreen = "list" | "detail";
export type TipOffSort = "latest" | "oldest" | "risk-high" | "risk-low";
export type ReviewDecision = "approved" | "pending" | "rejected" | null;
export type RejectReason =
  | "duplicate"
  | "not-jellyfish"
  | "unclear-photo"
  | "location-error"
  | null;
export type ThumbnailState = "loaded" | "loading" | "error" | "empty";

export type TipOffReportType = "mass-sighting" | "sting-incident" | "sighting";
export type AiVerdict = "normal" | "toxic_suspected" | "unknown";
export type AdminStatus =
  | "unreviewed"
  | "approved"
  | "pending"
  | "rejected"
  | "duplicate-report"
  | "admin-pending";

export type TipOffFilterState = {
  risks: RiskLevel[];
  reportTypes: TipOffReportType[];
  aiVerdicts: AiVerdict[];
  adminStatuses: AdminStatus[];
};

export const EMPTY_TIP_OFF_FILTER: TipOffFilterState = {
  risks: [],
  reportTypes: [],
  aiVerdicts: [],
  adminStatuses: [],
};

export type TipOffListItem = {
  id: string;
  title: string;
  beach: string;
  address: string;
  receivedAt: string;
  receivedAtSort: number;
  risk: RiskLevel;
  reportType: TipOffReportType;
  aiVerdict: AiVerdict;
  confidence: number;
  adminStatus: AdminStatus;
  reportStatus: BackendReportStatus;
  thumbnailState: ThumbnailState;
  thumbnailSrc?: string;
};

export type TipOffDetail = TipOffListItem & {
  description: string;
  images: string[];
  location: MapPoint | null;
  locationLabel: string;
};

export type ImagePreviewState = {
  tipOffId: string;
  index: number;
} | null;

export const REPORT_TYPE_LABEL: Record<TipOffReportType, string> = {
  "mass-sighting": "다수 출현",
  "sting-incident": "쏘임 사고",
  sighting: "발견",
};

export const AI_VERDICT_LABEL: Record<AiVerdict, string> = {
  normal: "일반",
  toxic_suspected: "독성 의심",
  unknown: "판별 불가",
};

export const ADMIN_STATUS_LABEL: Record<AdminStatus, string> = {
  unreviewed: "-",
  approved: "확인완료",
  pending: "관리자 보류",
  rejected: "반려",
  "duplicate-report": "중복 제보",
  "admin-pending": "관리자 확인중",
};

export const REJECT_REASON_LABEL: Record<Exclude<RejectReason, null>, string> = {
  duplicate: "중복",
  "not-jellyfish": "해파리 아님",
  "unclear-photo": "사진 불명확",
  "location-error": "위치 오류",
};

export const SORT_LABEL: Record<TipOffSort, string> = {
  latest: "최신순",
  oldest: "오래된 순",
  "risk-high": "위험도 높은 순",
  "risk-low": "위험도 낮은 순",
};

export const REVIEW_DECISION_LABEL: Record<Exclude<ReviewDecision, null>, string> = {
  approved: "확인 완료",
  pending: "보류",
  rejected: "반려",
};

export function canReviewReport(status: BackendReportStatus): boolean {
  // 검수 가능: AI 완료 대기, 보류(재판단). 확정/파이프라인 전/반영 완료는 잠금
  return status === "ai_done" || status === "hold";
}

export function countActiveTipOffFilters(filter: TipOffFilterState): number {
  return (
    filter.risks.length +
    filter.reportTypes.length +
    filter.aiVerdicts.length +
    filter.adminStatuses.length
  );
}
