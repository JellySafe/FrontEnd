import type { AnalysisResult, ReportType } from "../types";

const ANALYZE_DELAY_MS = 2500;
const ERROR_RATE = 0.1;

// 백엔드 연동 전 유형별 결정적 mock 매핑
const MOCK_RESULT_BY_TYPE: Record<ReportType, AnalysisResult> = {
  sighting: {
    kind: "general",
    label: "일반 해파리 의심",
    probability: 99,
    confidence: 67,
  },
  swarm: {
    kind: "toxic",
    label: "독성 해파리 의심",
    probability: 99,
    confidence: 67,
  },
  sting: { kind: "unknown" },
};

// 2.5초 지연 후 결과를 반환하는 mock AI 분석(10% 확률로 오류)
export function analyzeReport(reportType: ReportType): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Math.random() < ERROR_RATE
          ? { kind: "error" }
          : MOCK_RESULT_BY_TYPE[reportType],
      );
    }, ANALYZE_DELAY_MS);
  });
}
