import type { BackendHorizon, BackendRiskLevel, DataConfidence } from "@/shared/api/types";
import type { RiskLevel, TimeFrame } from "./types";

export function toRiskLevel(level: BackendRiskLevel): RiskLevel {
  if (level === "severe") return "critical";
  return level;
}

export function toRiskLevelSafe(level: BackendRiskLevel | undefined): RiskLevel {
  if (!level) return "safe";
  return toRiskLevel(level);
}

export function confidenceToPercent(confidence: DataConfidence): number {
  switch (confidence) {
    case "high":
      return 90;
    case "medium":
      return 70;
    case "low":
      return 50;
  }
}

export function formatSignedDelta(value: number): string {
  if (value > 0) return `+${value}`;
  return String(value);
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

export function formatGeneratedAt(iso: string | null): string {
  const formatted = formatDateTime(iso);
  return formatted === "—" ? formatted : `${formatted} 기준`;
}

export function horizonToTimeFrame(horizon: BackendHorizon): TimeFrame | null {
  if (horizon === "now") return "current";
  if (horizon === "24h") return "after24h";
  if (horizon === "72h") return "after72h";
  return null;
}

export function timeFrameToHorizon(time: TimeFrame | null): BackendHorizon {
  if (time === "after24h") return "24h";
  if (time === "after72h") return "72h";
  return "now";
}
