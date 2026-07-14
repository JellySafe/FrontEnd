import type { RiskCause, RiskLevel } from "@/shared/risk/types";
import type { ResponseLogEntry } from "@/features/detailed-map/types";

export type ReportStatus = "empty" | "loading" | "ready";

export type ReportHourlyRisk = {
  hour: string;
  risk: RiskLevel | null;
};

export type ReportStats = {
  tipOffCount: string;
  toxicCount: string;
  stingCount: string;
};

export type ReportData = {
  reportId: number;
  hourly: ReportHourlyRisk[];
  stats: ReportStats;
  causes: RiskCause[];
  history: ResponseLogEntry[];
  riskChangeSummary: string | null;
  maxRisk: RiskLevel | null;
};
