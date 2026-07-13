import type { BeachDetail, BeachSummary, DashboardStat } from "../types";

export const DASHBOARD_TIMESTAMP = "2026.02.07 21:47 기준";

export const DASHBOARD_STATS: DashboardStat[] = [
  {
    id: "total-risk",
    label: "전체 위험도",
    value: "76",
    delta: "+22",
    deltaCaption: "어제보다",
    status: "critical",
    statusLabel: "심각",
  },
  { id: "danger-beaches", label: "위험 이상 해변 수", value: "4", delta: "+99", deltaCaption: "어제보다" },
  { id: "toxic-reports", label: "독성 의심 제보 수", value: "31", delta: "+99", deltaCaption: "어제보다" },
  { id: "unidentified-reports", label: "미확인 제보 수", value: "55", delta: "+99", deltaCaption: "어제보다" },
  { id: "response-records", label: "대응 기록 수", value: "0", delta: "+99", deltaCaption: "어제보다" },
];

// 지도 마커 데이터. 좌표는 실제 해변 GPS 위경도(lat/lng).
export const BEACHES: BeachSummary[] = [
  { id: "samyang", name: "삼양 해수욕장", address: "제주 제주시 삼양동", risk: "critical", riskScore: 99, confidence: 99, causeSummary: "수온 상승, 파고 증가", hasUnidentifiedReport: true, point: { lat: 33.5253, lng: 126.5859 } },
  { id: "hamdeok", name: "함덕 해수욕장", address: "제주 제주시 조천읍", risk: "danger", riskScore: 78, confidence: 97, causeSummary: "수온 상승, 파고 증가", hasUnidentifiedReport: true, point: { lat: 33.5432, lng: 126.6698 } },
  { id: "gimnyeong", name: "김녕 해수욕장", address: "제주 제주시 구좌읍", risk: "caution", riskScore: 54, confidence: 95, causeSummary: "해변 방향 풍향", hasUnidentifiedReport: false, point: { lat: 33.5578, lng: 126.7583 } },
  { id: "woljeong", name: "월정 해수욕장", address: "제주 제주시 구좌읍", risk: "safe", riskScore: 12, confidence: 96, causeSummary: "과거 출현 이력", hasUnidentifiedReport: false, point: { lat: 33.5565, lng: 126.7959 } },
  { id: "seongsan", name: "성산일출봉 해변", address: "제주 서귀포시 성산읍", risk: "danger", riskScore: 71, confidence: 94, causeSummary: "파고 증가", hasUnidentifiedReport: true, point: { lat: 33.4590, lng: 126.9360 } },
  { id: "pyoseon", name: "표선 해수욕장", address: "제주 서귀포시 표선면", risk: "caution", riskScore: 48, confidence: 93, causeSummary: "수온 상승", hasUnidentifiedReport: false, point: { lat: 33.3262, lng: 126.8339 } },
  { id: "jungmun", name: "중문색달 해수욕장", address: "제주 서귀포시 색달동", risk: "critical", riskScore: 92, confidence: 98, causeSummary: "수온 상승, 독성 의심 제보", hasUnidentifiedReport: true, point: { lat: 33.2447, lng: 126.4103 } },
  { id: "hwasun", name: "화순금모래 해변", address: "제주 서귀포시 안덕면", risk: "safe", riskScore: 18, confidence: 92, causeSummary: "과거 출현 이력", hasUnidentifiedReport: false, point: { lat: 33.2383, lng: 126.3348 } },
  { id: "hyeopjae", name: "협재 해수욕장", address: "제주 제주시 한림읍", risk: "caution", riskScore: 51, confidence: 95, causeSummary: "해변 방향 풍향", hasUnidentifiedReport: false, point: { lat: 33.3941, lng: 126.2396 } },
  { id: "iho", name: "이호테우 해수욕장", address: "제주 제주시 이호동", risk: "danger", riskScore: 66, confidence: 96, causeSummary: "파고 증가, 수온 상승", hasUnidentifiedReport: true, point: { lat: 33.4986, lng: 126.4525 } },
];

const SHARED_HOURLY = [
  { timeFrame: "current" as const, label: "현재", score: 50, confidence: 99, risk: "caution" as const },
  { timeFrame: "after24h" as const, label: "24시간 후", score: 100, confidence: 99, risk: "critical" as const },
  { timeFrame: "after72h" as const, label: "72시간 후", score: 70, confidence: 99, risk: "danger" as const },
];

// 선택된 해변의 상세 데이터. 실제 API 연동 전까지 공통 mock을 요약 데이터와 합쳐 반환한다.
export function getBeachDetail(beach: BeachSummary): BeachDetail {
  return {
    ...beach,
    createdAt: DASHBOARD_TIMESTAMP,
    collectedAt: DASHBOARD_TIMESTAMP,
    hourly: SHARED_HOURLY,
  };
}
