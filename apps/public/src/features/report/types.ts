import type { MapPoint } from "@/shared/risk/types";

// 제보 유형(단일 선택)
export type ReportType = "sighting" | "swarm" | "sting";

export const REPORT_TYPE_LABEL: Record<ReportType, string> = {
  sighting: "발견",
  swarm: "다수 출현",
  sting: "쏘임 사고",
};

// 주소 검색/현재 위치로 결정된 발견 위치
export type ReportLocation = {
  name: string;
  address: string;
  point: MapPoint;
};

// mock AI 분석 결과(오류 케이스 포함)
export type AnalysisResult =
  | {
      kind: "general" | "toxic";
      label: string;
      probability: number;
      confidence: number;
    }
  | { kind: "unknown" }
  | { kind: "error" };

// 제출된 제보 스냅샷(분석/결과 화면 표시용)
export type SubmittedReport = {
  locationName: string;
  discoveredAt: Date;
  reportType: ReportType;
};
