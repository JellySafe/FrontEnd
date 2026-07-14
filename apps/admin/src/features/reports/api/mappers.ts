import { factorsToCauses, toResponseLogEntry } from "@/features/detailed-map/api/mappers";
import type { ResponseLogEntry } from "@/features/detailed-map/types";
import type {
  AdminBeachRiskResponse,
  BackendRiskLevel,
  DailyReportResponse,
  DailyRiskFactorResponse,
  OperationActionListItemResponse,
  RiskTrendPointResponse,
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

// generatedAt(UTC)에서 KST 기준 시(0~23)를 뽑기 위한 포매터
const KST_HOUR_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  hour12: false,
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

// riskTrend(UTC 지점 배열)를 25슬롯 시간대 배지로 매핑. 같은 KST 시엔 가장 늦은 지점 사용
export function hourlyFromRiskTrend(
  trend: RiskTrendPointResponse[],
): ReportHourlyRisk[] {
  const slots: ReportHourlyRisk[] = HOURS.map((hour) => ({ hour, risk: null }));
  const slotTimestamps = new Array<number>(slots.length).fill(-Infinity);

  for (const point of trend) {
    const time = new Date(point.generatedAt).getTime();
    if (Number.isNaN(time)) continue;

    const rawHour = Number(KST_HOUR_FORMATTER.format(new Date(point.generatedAt)));
    if (Number.isNaN(rawHour)) continue;

    // hour12:false 에서 자정이 "24"로 나오는 런타임 방어
    const hour = rawHour % 24;
    if (time < slotTimestamps[hour]) continue;

    slotTimestamps[hour] = time;
    slots[hour] = { hour: slots[hour].hour, risk: toRiskLevel(point.riskLevel) };
  }

  return slots;
}

// topFactors 를 주요 위험 원인 카드용 RiskCause 배열로 매핑
export function causesFromTopFactors(
  factors: DailyRiskFactorResponse[],
): RiskCause[] {
  return factors.map((factor) => ({
    title: factor.name,
    description: factor.detail ?? "",
  }));
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
    hourly: hourlyFromRiskTrend(report.riskTrend ?? []),
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
