import type { ReportData, ReportHourlyRisk } from "../types";

const HOURS = Array.from({ length: 25 }, (_, index) =>
  `${String(index).padStart(2, "0")}:00`,
);

const RISK_BY_HOUR: Array<ReportData["hourly"][number]["risk"]> = [
  "safe",
  "safe",
  "safe",
  "caution",
  "caution",
  "critical",
  "critical",
  "caution",
  "danger",
  "caution",
  "safe",
  "safe",
  "safe",
  "critical",
  "critical",
  "critical",
  "critical",
  "critical",
  "critical",
  "critical",
  "critical",
  "critical",
  "critical",
  "critical",
  "critical",
];

const HISTORY_CONTENT =
  "AI 예측 결과에 따라 해파리 출몰 위험이 높아질 것으로 판단되어 해수욕장 전 구역을 대상으로 안전 안내방송을 실시했습니다. 방문객에게 입수 시 주의사항과 해파리 발견 시 행동 요령을 안내했으며, 현장 안전요원에게도 동일 내용을 공유했습니다.";

export const REPORT_DATA: ReportData = {
  hourly: HOURS.map((hour, index) => ({
    hour,
    risk: RISK_BY_HOUR[index] ?? null,
  })),
  stats: {
    tipOffCount: "1,000",
    toxicCount: "1,000",
    stingCount: "11,000",
  },
  causes: [
    {
      title: "수온 상승",
      description:
        "최근 해수 온도가 상승하면서 해파리가 서식·활동하기 좋은 환경이 형성되었습니다.",
    },
    {
      title: "파고 증가",
      description:
        "높은 파도로 인해 먼 바다에 있던 해파리가 해안까지 이동한 것으로 분석됩니다.",
    },
    {
      title: "해변 방향 풍향",
      description:
        "바람이 해변 방향으로 불어 해파리가 연안으로 밀려왔을 가능성이 높습니다.",
    },
    {
      title: "과거 출현 이력",
      description:
        "과거에도 동일 해역에서 해파리 출현이 반복되어 이번에도 출현 가능성이 높게 분석되었습니다.",
    },
    {
      title: "독성 의심 제보",
      description:
        "인근 해역에서 독성 해파리 의심 제보가 접수되어 출현 가능성이 높아진 것으로 판단됩니다.",
    },
  ],
  history: [
    {
      id: "report-log-1",
      actionLabel: "안내방송 실시",
      savedAt: "2026.07.19 21:47 저장",
      actionAt: "2026.07.19 14:35",
      manager: "김민수 안전관리자",
      content: HISTORY_CONTENT,
      results: ["안내방송 완료", "방문객 안전수칙 안내 완료", "현장 순찰 지속 예정"],
      memo: "15:00 이후 위험도 변동 여부를 재확인하고 필요 시 추가 안내방송을 실시할 예정입니다.",
    },
    {
      id: "report-log-2",
      actionLabel: "안내방송 실시",
      savedAt: "2026.07.19 21:47 저장",
      actionAt: "2026.07.19 14:35",
      manager: "김민수 안전관리자",
      content: HISTORY_CONTENT,
      results: ["안내방송 완료", "방문객 안전수칙 안내 완료", "현장 순찰 지속 예정"],
      memo: "15:00 이후 위험도 변동 여부를 재확인하고 필요 시 추가 안내방송을 실시할 예정입니다.",
    },
  ],
};

export const EMPTY_HOURLY: ReportHourlyRisk[] = HOURS.map((hour) => ({
  hour,
  risk: null,
}));
