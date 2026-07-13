import { BEACHES } from "@/features/dashboard/mocks/dashboard.mock";
import type { HourlyRisk, RiskCause, TimeFrame } from "@/shared/risk/types";
import type {
  CauseFrameData,
  DetailedBeach,
  ResponseAction,
  ResponseLogEntry,
  ResponseRecommendation,
} from "../types";

const TIMESTAMP = "2026.02.07 21:47 기준";

const HOURLY: HourlyRisk[] = [
  { timeFrame: "current", label: "현재", score: 50, confidence: 99, risk: "caution" },
  { timeFrame: "after24h", label: "내일 (24시간 후)", score: 100, confidence: 99, risk: "critical" },
  { timeFrame: "after72h", label: "3일 후 (72시간 후)", score: 70, confidence: 99, risk: "danger" },
];

const CAUSES: RiskCause[] = [
  { title: "수온 상승", description: "최근 해수 온도가 상승하면서 해파리가 서식·활동하기 좋은 환경이 형성되었습니다." },
  { title: "파고 증가", description: "높은 파도로 인해 먼 바다에 있던 해파리가 해안까지 이동한 것으로 분석됩니다." },
  { title: "해변 방향 풍향", description: "바람이 해변 방향으로 불어 해파리가 연안으로 밀려왔을 가능성이 높습니다." },
  { title: "과거 출현 이력", description: "과거에도 동일 해역에서 해파리 출현이 반복되어 이번에도 출현 가능성이 높게 분석되었습니다." },
  { title: "독성 의심 제보", description: "인근 해역에서 독성 해파리 의심 제보가 접수되어 출현 가능성이 높아진 것으로 판단됩니다." },
];

const CAUSE_BY_FRAME: Record<TimeFrame, CauseFrameData> = {
  current: { causes: CAUSES },
  after24h: { causes: CAUSES },
  after72h: { causes: CAUSES },
};

const RECOMMENDATIONS: ResponseRecommendation[] = [
  {
    id: "monitoring",
    risk: "caution",
    title: "모니터링 강화",
    description: "해파리 출몰 가능성이 감지되고 있습니다. 순찰을 강화하고 해변 상황을 지속적으로 확인해 주세요.",
  },
  {
    id: "entry-warning",
    risk: "danger",
    title: "입수 주의 전달",
    description: "방문객의 입수 시 각별한 주의가 필요합니다. 안전수칙을 안내하고 위험 정보를 충분히 전달해 주세요.",
  },
  {
    id: "add-guard",
    risk: "danger",
    title: "안전요원 추가",
    description: "신속한 대응을 위해 안전요원 추가 배치를 권장합니다. 순찰 구간을 확대하고 응급 상황에 대비해 주세요.",
  },
  {
    id: "broadcast",
    risk: "danger",
    title: "안내방송",
    description: "현재 해변의 위험 정보를 안내방송으로 알려주세요. 방문객이 상황을 인지하고 안전하게 행동할 수 있도록 안내가 필요합니다.",
  },
  {
    id: "entry-ban-review",
    risk: "critical",
    title: "입수 통제 검토",
    description: "해파리 출몰 위험이 높게 예측됩니다. 현장 상황을 확인한 뒤 입수 제한 여부를 검토해 주세요.",
  },
  {
    id: "zone-control",
    risk: "critical",
    title: "입수 통제 검토",
    description: "특정 구역의 위험도가 매우 높습니다. 방문객의 안전을 위해 구역 폐쇄 또는 출입 제한을 검토해 주세요.",
  },
  {
    id: "emergency-alert",
    risk: "critical",
    title: "긴급 알림",
    description: "긴급 대응이 필요한 상황입니다. 즉시 위험 정보를 안내하고 필요한 안전 조치를 시행해 주세요.",
  },
];

// 대응 기록 폼의 수행한 조치 선택지
export const RESPONSE_ACTIONS: ResponseAction[] = [
  { id: "normal", label: "정상 운영" },
  { id: "entry-caution", label: "입수 주의 안내" },
  { id: "monitoring", label: "모니터링 강화" },
  { id: "add-guard", label: "안전요원 추가" },
  { id: "broadcast", label: "안내방송" },
  { id: "zone-review", label: "구역 통제 검토" },
  { id: "entry-ban", label: "입수 통제" },
  { id: "reopen", label: "운영 재개" },
];

const HISTORY_CONTENT =
  "AI 예측 결과에 따라 해파리 출몰 위험이 높아질 것으로 판단되어 해수욕장 전 구역을 대상으로 안전 안내방송을 실시했습니다. 방문객에게 입수 시 주의사항과 해파리 발견 시 행동 요령을 안내했으며, 현장 안전요원에게도 동일 내용을 공유했습니다.";

// 대응 기록 이력(mock). 실제 저장은 백엔드 연동 시 구현한다.
export const RESPONSE_HISTORY: ResponseLogEntry[] = [
  {
    id: "log-1",
    actionLabel: "안내방송 실시",
    savedAt: "2026.07.19 21:47 저장",
    actionAt: "2026.07.19 14:35",
    manager: "김민수 안전관리자",
    content: HISTORY_CONTENT,
    results: ["안내방송 완료", "방문객 안전수칙 안내 완료", "현장 순찰 지속 예정"],
    memo: "15:00 이후 위험도 변동 여부를 재확인하고 필요 시 추가 안내방송을 실시할 예정입니다.",
  },
  {
    id: "log-2",
    actionLabel: "안내방송 실시",
    savedAt: "2026.07.18 10:12 저장",
    actionAt: "2026.07.18 09:50",
    manager: "김민수 안전관리자",
    content: HISTORY_CONTENT,
    results: ["안내방송 완료", "방문객 안전수칙 안내 완료"],
    memo: "오전 순찰 결과 특이사항 없음.",
  },
];

const DEFAULT_BEACH = {
  id: "samyang",
  name: "삼양 해수욕장",
  address: "제주 제주시 삼양동",
  risk: "critical" as const,
};

// 상세 대상 해변. Dashboard에서 넘어온 beachId가 있으면 해당 해변 요약으로 헤더를 맞춘다.
export function getDetailedBeach(beachId?: string): DetailedBeach {
  const summary = BEACHES.find((beach) => beach.id === beachId);
  const base = summary ?? DEFAULT_BEACH;
  return {
    id: base.id,
    name: base.name,
    address: base.address,
    risk: base.risk,
    createdAt: TIMESTAMP,
    collectedAt: TIMESTAMP,
    hourly: HOURLY,
    causeByFrame: CAUSE_BY_FRAME,
    recommendations: RECOMMENDATIONS,
  };
}
