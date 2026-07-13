// Public 위험도 도메인 타입/상수. 해변 검색·상세·알림 화면이 공용.
export type RiskLevel = "safe" | "caution" | "danger" | "critical";
export type TimeFrame = "current" | "after24h" | "after72h";

export type MapPoint = { lat: number; lng: number };

export type HourlyRisk = {
  timeFrame: TimeFrame;
  label: string;
  score: number;
  confidence: number;
  risk: RiskLevel;
};

export type RiskCause = { title: string; description: string };

export const RISK_LABEL: Record<RiskLevel, string> = { safe: "안전", caution: "주의", danger: "위험", critical: "심각" };

// 데이터 신뢰도 표시 라벨(API는 high/medium/low만 제공, 숫자 %는 사용하지 않음)
export const CONFIDENCE_LABEL: Record<"high" | "medium" | "low", string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};
export const RISK_ORDER: RiskLevel[] = ["safe", "caution", "danger", "critical"];
export const TIME_FRAME_LABEL: Record<TimeFrame, string> = { current: "현재", after24h: "24시간 후", after72h: "72시간 후" };

export const RISK_GUIDE_MESSAGE: Record<RiskLevel, string> = {
  safe: "현재 해변은 안전하게 이용할 수 있습니다. 실시간 상황에 따라 위험도가 변할 수 있으니 안내 사항을 틈틈히 확인해 주세요.",
  caution: "해파리 출몰 가능성이 있습니다. 입수 전 주변을 살피고 안전요원의 안내를 따라주세요.",
  danger: "해파리 출몰 위험이 높습니다. 입수 시 각별히 주의하고 어린이와 노약자는 입수를 자제해 주세요.",
  critical: "심각 단계에서는 안전사고 예방을 위해 입수를 자제해 주시기 바랍니다.",
};
