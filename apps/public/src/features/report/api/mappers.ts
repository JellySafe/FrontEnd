import type { ReportBackendType, ReportResultResponse, ReportStatus } from "@/shared/api/types";
import type { AnalysisResult, ReportType } from "../types";

// 프론트 제보 유형 → 백엔드 reportType 매핑
const BACKEND_REPORT_TYPE: Record<ReportType, ReportBackendType> = {
  sighting: "general",
  swarm: "multiple",
  sting: "sting",
};

export function toBackendReportType(type: ReportType): ReportBackendType {
  return BACKEND_REPORT_TYPE[type];
}

// 폴링 종결 상태 여부. 종결이면 폴링 중단 후 결과 화면으로.
const TERMINAL_STATUSES: ReadonlySet<ReportStatus> = new Set<ReportStatus>([
  "ai_done",
  "verified",
  "rejected",
  "hold",
  "reflected",
]);

export function isTerminalStatus(status: ReportStatus): boolean {
  return TERMINAL_STATUSES.has(status);
}

// 서버 결과 응답 → 화면용 AnalysisResult 매핑
export function toAnalysisResult(res: ReportResultResponse): AnalysisResult {
  // aiConfidence(0~1)를 백분율 반올림. null이면 신뢰도 줄 미표시를 위해 null 유지.
  const confidence = res.aiConfidence === null ? null : Math.round(res.aiConfidence * 100);

  if (res.aiResult === "normal") {
    return {
      kind: "general",
      label: "독성 미확인 해파리",
      confidence,
      guideMessage: res.guideMessage,
    };
  }

  if (res.aiResult === "toxic_suspected") {
    return {
      kind: "toxic",
      label: "독성 해파리 의심",
      confidence,
      guideMessage: res.guideMessage,
    };
  }

  // "unknown" 또는 null
  return { kind: "unknown", guideMessage: res.guideMessage };
}
