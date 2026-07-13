// Admin 공통 위험도 도메인 타입/상수. Dashboard와 Detailed Map이 함께 사용한다.
// 백엔드 DTO를 단정하지 않고 화면 표현에 필요한 최소 형태만 정의한다.

export type RiskLevel = "safe" | "caution" | "danger" | "critical";
export type TimeFrame = "current" | "after24h" | "after72h";

// 시간대별 위험도(막대 차트/원인 탭 공용)
export type HourlyRisk = {
  timeFrame: TimeFrame;
  label: string;
  score: number;
  confidence: number;
  risk: RiskLevel;
};

export type RiskCause = {
  title: string;
  description: string;
};

export const RISK_LABEL: Record<RiskLevel, string> = {
  safe: "안전",
  caution: "주의",
  danger: "위험",
  critical: "심각",
};

// 위험도 노출 순서(필터/범례 공용)
export const RISK_ORDER: RiskLevel[] = ["safe", "caution", "danger", "critical"];

export const RISK_DOT_CLASS: Record<RiskLevel, string> = {
  safe: "bg-[var(--color-safe-50)]",
  caution: "bg-[var(--color-caution-30)]",
  danger: "bg-[var(--color-danger-50)]",
  critical: "bg-[var(--color-critical-50)]",
};

export const TIME_FRAME_LABEL: Record<TimeFrame, string> = {
  current: "현재",
  after24h: "24시간 후",
  after72h: "72시간 후",
};
