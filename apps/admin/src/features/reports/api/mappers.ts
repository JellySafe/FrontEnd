import { factorsToCauses, toResponseLogEntry } from "@/features/detailed-map/api/mappers";
import type { ResponseLogEntry } from "@/features/detailed-map/types";
import type {
  AdminBeachRiskResponse,
  BackendRiskLevel,
  DailyReportResponse,
  OperationActionListItemResponse,
} from "@/shared/api/types";
import { toRiskLevel } from "@/shared/risk/mappers";
import type { RiskCause, RiskLevel } from "@/shared/risk/types";
import { RISK_LABEL } from "@/shared/risk/types";
import type { ReportData, ReportHourlyRisk } from "../types";

const HOURS = Array.from({ length: 25 }, (_, index) =>
  `${String(index).padStart(2, "0")}:00`,
);

export const EMPTY_HOURLY: ReportHourlyRisk[] = HOURS.map((hour) => ({
  hour,
  risk: null,
}));

const BACKEND_RISK_PATTERN = /\b(safe|caution|danger|severe)\b/gi;

const KST_DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
});

export function formatCount(value: number): string {
  return value.toLocaleString("ko-KR");
}

export function localizeRiskChangeSummary(summary: string | null): string | null {
  if (!summary) return null;

  return summary.replace(BACKEND_RISK_PATTERN, (match) => {
    const level = match.toLowerCase() as BackendRiskLevel;
    return RISK_LABEL[toRiskLevel(level)];
  });
}

export function filterActionsByReportDate(
  actions: OperationActionListItemResponse[],
  reportDate: string,
): OperationActionListItemResponse[] {
  return actions.filter(
    (action) => KST_DATE_FORMATTER.format(new Date(action.createdAt)) === reportDate,
  );
}

export function causesFromBeachRisk(risk: AdminBeachRiskResponse): RiskCause[] {
  const nowCard = risk.cards.find((card) => card.horizon === "now");
  return factorsToCauses(nowCard?.factors ?? []);
}

export function toReportHistory(
  actions: OperationActionListItemResponse[],
): ResponseLogEntry[] {
  return actions.map(toResponseLogEntry);
}

export function toReportData(
  report: DailyReportResponse,
  causes: RiskCause[],
  history: ResponseLogEntry[],
): ReportData {
  return {
    reportId: report.reportId ?? 0,
    hourly: EMPTY_HOURLY,
    stats: {
      tipOffCount: formatCount(report.reportCount),
      toxicCount: formatCount(report.toxicCount),
      stingCount: formatCount(report.stingCount),
    },
    causes,
    history,
    riskChangeSummary: localizeRiskChangeSummary(report.riskChangeSummary),
    maxRisk: report.maxRiskLevel ? toRiskLevel(report.maxRiskLevel) : null,
  };
}
