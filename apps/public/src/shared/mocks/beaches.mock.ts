import type { HourlyRisk, MapPoint, RiskCause, RiskLevel, TimeFrame } from "@/shared/risk/types";
import { TIME_FRAME_LABEL } from "@/shared/risk/types";

// 해변 목록 요약(검색/카드용)
export type BeachSummary = {
  id: string;
  name: string;
  address: string;
  risk: RiskLevel;
  riskScore: number;
  confidence: number;
  point: MapPoint;
  imageSrc: string;
};

// 해변 상세(시간대별 위험도/원인/대체 해변 포함)
export type BeachDetail = BeachSummary & {
  hourly: HourlyRisk[];
  causesByTime: Record<TimeFrame, RiskCause[]>;
  alternativeBeachIds: string[];
};

// 모든 해변 공통 placeholder 이미지(Figma 카드 사진 에셋)
const PLACEHOLDER_IMAGE = "/assets/beaches/placeholder.png";

// current 시간대 HourlyRisk 생성 헬퍼(해변 현재 값 그대로 사용)
function currentHourly(risk: RiskLevel, score: number, confidence: number): HourlyRisk {
  return { timeFrame: "current", label: TIME_FRAME_LABEL.current, score, confidence, risk };
}

function futureHourly(
  timeFrame: Exclude<TimeFrame, "current">,
  score: number,
  confidence: number,
  risk: RiskLevel,
): HourlyRisk {
  return { timeFrame, label: TIME_FRAME_LABEL[timeFrame], score, confidence, risk };
}

export const BEACHES: BeachDetail[] = [
  {
    id: "samyang",
    name: "삼양 해수욕장",
    address: "제주 제주시 삼양동",
    risk: "critical",
    riskScore: 99,
    confidence: 99,
    point: { lat: 33.5253, lng: 126.5859 },
    imageSrc: PLACEHOLDER_IMAGE,
    hourly: [
      currentHourly("critical", 99, 99),
      futureHourly("after24h", 88, 96, "critical"),
      futureHourly("after72h", 72, 93, "danger"),
    ],
    causesByTime: {
      current: [
        { title: "수온 상승", description: "삼양 해변 표층 수온이 평년보다 크게 높아 해파리 밀집이 심각합니다." },
        { title: "과거 출현 이력", description: "최근 삼양 인근에서 대형 해파리 출현 신고가 반복적으로 접수되었습니다." },
        { title: "독성 의심 제보", description: "쏘임 피해 제보가 다수 접수되어 독성 해파리 가능성이 높습니다." },
      ],
      after24h: [
        { title: "수온 상승", description: "24시간 후에도 삼양 해변의 높은 수온이 유지되어 밀집이 지속될 전망입니다." },
        { title: "해변 방향 풍향", description: "해변 방향으로 부는 바람이 이어져 해파리 유입이 계속될 것으로 보입니다." },
      ],
      after72h: [
        { title: "수온 상승", description: "72시간 후 수온이 다소 내려가며 밀집도가 점차 완화될 것으로 예상됩니다." },
        { title: "과거 출현 이력", description: "과거 패턴상 사흘 뒤에도 잔존 개체가 남아 위험이 이어질 수 있습니다." },
      ],
    },
    alternativeBeachIds: ["woljeong", "hwasun", "gimnyeong", "hyeopjae"],
  },
  {
    id: "hamdeok",
    name: "함덕 해수욕장",
    address: "제주 제주시 조천읍",
    risk: "danger",
    riskScore: 78,
    confidence: 97,
    point: { lat: 33.5432, lng: 126.6698 },
    imageSrc: PLACEHOLDER_IMAGE,
    hourly: [
      currentHourly("danger", 78, 97),
      futureHourly("after24h", 84, 95, "critical"),
      futureHourly("after72h", 66, 93, "danger"),
    ],
    causesByTime: {
      current: [
        { title: "파고 증가", description: "함덕 앞바다 파고가 높아지며 해파리가 연안으로 밀려들고 있습니다." },
        { title: "수온 상승", description: "표층 수온 상승으로 함덕 해변 인근 해파리 활동이 활발합니다." },
      ],
      after24h: [
        { title: "해변 방향 풍향", description: "24시간 뒤 해변 방향 풍향이 강해져 함덕 유입량이 늘어날 전망입니다." },
        { title: "파고 증가", description: "이어지는 높은 파고로 해파리 유입 위험이 한층 커집니다." },
        { title: "과거 출현 이력", description: "성수기 함덕에서 다수 출현한 이력이 있어 주의가 필요합니다." },
      ],
      after72h: [
        { title: "수온 상승", description: "72시간 후 수온이 소폭 낮아지며 위험도가 다소 완화됩니다." },
        { title: "파고 증가", description: "잔여 너울로 인해 해파리 유입 가능성은 여전히 남아 있습니다." },
      ],
    },
    alternativeBeachIds: ["woljeong", "hwasun", "hyeopjae", "pyoseon"],
  },
  {
    id: "gimnyeong",
    name: "김녕 해수욕장",
    address: "제주 제주시 구좌읍",
    risk: "caution",
    riskScore: 54,
    confidence: 95,
    point: { lat: 33.5578, lng: 126.7583 },
    imageSrc: PLACEHOLDER_IMAGE,
    hourly: [
      currentHourly("caution", 54, 95),
      futureHourly("after24h", 62, 94, "danger"),
      futureHourly("after72h", 48, 92, "caution"),
    ],
    causesByTime: {
      current: [
        { title: "수온 상승", description: "김녕 해변 수온이 완만히 오르며 해파리 출몰 가능성이 커지고 있습니다." },
        { title: "과거 출현 이력", description: "지난해 같은 시기 김녕에서 소규모 출현이 관측된 바 있습니다." },
      ],
      after24h: [
        { title: "해변 방향 풍향", description: "24시간 후 해변 방향 바람이 강해져 김녕 해변 유입이 증가할 전망입니다." },
        { title: "수온 상승", description: "수온 상승세가 이어져 해파리 활동이 더 활발해집니다." },
      ],
      after72h: [
        { title: "수온 상승", description: "72시간 후 수온이 안정되며 김녕 해변 위험도가 낮아질 것으로 보입니다." },
      ],
    },
    alternativeBeachIds: ["woljeong", "hwasun", "hyeopjae"],
  },
  {
    id: "woljeong",
    name: "월정 해수욕장",
    address: "제주 제주시 구좌읍",
    risk: "safe",
    riskScore: 12,
    confidence: 96,
    point: { lat: 33.5565, lng: 126.7959 },
    imageSrc: PLACEHOLDER_IMAGE,
    hourly: [
      currentHourly("safe", 12, 96),
      futureHourly("after24h", 20, 95, "safe"),
      futureHourly("after72h", 28, 93, "caution"),
    ],
    causesByTime: {
      current: [
        { title: "과거 출현 이력", description: "월정 해변은 최근 해파리 신고가 거의 없어 안전한 상태입니다." },
      ],
      after24h: [
        { title: "수온 상승", description: "24시간 후 수온이 소폭 오르지만 월정 해변은 여전히 안전 수준입니다." },
      ],
      after72h: [
        { title: "해변 방향 풍향", description: "72시간 후 풍향 변화로 월정 해변에 소량 유입 가능성이 생깁니다." },
        { title: "수온 상승", description: "수온 상승이 이어지면 주의 단계로 올라설 수 있어 지켜볼 필요가 있습니다." },
      ],
    },
    alternativeBeachIds: ["hwasun", "gimnyeong", "pyoseon", "hyeopjae"],
  },
  {
    id: "seongsan",
    name: "성산일출봉 해변",
    address: "제주 서귀포시 성산읍",
    risk: "danger",
    riskScore: 71,
    confidence: 94,
    point: { lat: 33.459, lng: 126.936 },
    imageSrc: PLACEHOLDER_IMAGE,
    hourly: [
      currentHourly("danger", 71, 94),
      futureHourly("after24h", 63, 93, "danger"),
      futureHourly("after72h", 55, 91, "caution"),
    ],
    causesByTime: {
      current: [
        { title: "파고 증가", description: "성산 앞바다 파고가 높아 해파리가 해변으로 밀려들고 있습니다." },
        { title: "해변 방향 풍향", description: "동쪽에서 해변으로 부는 바람이 성산 해변 유입을 키우고 있습니다." },
      ],
      after24h: [
        { title: "수온 상승", description: "24시간 뒤 수온이 유지되며 성산 해변의 위험이 이어집니다." },
        { title: "파고 증가", description: "높은 파고가 계속되어 유입 위험이 남아 있습니다." },
      ],
      after72h: [
        { title: "해변 방향 풍향", description: "72시간 후 풍향이 바뀌며 성산 해변 유입이 줄어들 전망입니다." },
      ],
    },
    alternativeBeachIds: ["pyoseon", "hwasun", "woljeong"],
  },
  {
    id: "pyoseon",
    name: "표선 해수욕장",
    address: "제주 서귀포시 표선면",
    risk: "caution",
    riskScore: 48,
    confidence: 93,
    point: { lat: 33.3262, lng: 126.8339 },
    imageSrc: PLACEHOLDER_IMAGE,
    hourly: [
      currentHourly("caution", 48, 93),
      futureHourly("after24h", 40, 92, "caution"),
      futureHourly("after72h", 33, 90, "caution"),
    ],
    causesByTime: {
      current: [
        { title: "수온 상승", description: "표선 해변 수온이 서서히 올라 해파리 출몰 가능성이 있습니다." },
        { title: "과거 출현 이력", description: "표선에서 소규모 출현 이력이 있어 입수 전 주의가 필요합니다." },
      ],
      after24h: [
        { title: "수온 상승", description: "24시간 후 수온이 소폭 낮아지며 위험도가 완화됩니다." },
      ],
      after72h: [
        { title: "과거 출현 이력", description: "72시간 후에도 표선 해변은 주의 수준을 유지할 것으로 보입니다." },
      ],
    },
    alternativeBeachIds: ["hwasun", "woljeong", "gimnyeong"],
  },
  {
    id: "jungmun",
    name: "중문색달 해수욕장",
    address: "제주 서귀포시 색달동",
    risk: "critical",
    riskScore: 92,
    confidence: 98,
    point: { lat: 33.2447, lng: 126.4103 },
    imageSrc: PLACEHOLDER_IMAGE,
    hourly: [
      currentHourly("critical", 92, 98),
      futureHourly("after24h", 80, 96, "critical"),
      futureHourly("after72h", 68, 94, "danger"),
    ],
    causesByTime: {
      current: [
        { title: "독성 의심 제보", description: "중문 해변에서 쏘임 피해 제보가 잇따라 독성 해파리가 의심됩니다." },
        { title: "수온 상승", description: "높은 표층 수온으로 중문 해변 해파리 밀집이 심각한 상태입니다." },
        { title: "파고 증가", description: "너울성 파도로 대형 해파리가 해변으로 밀려들고 있습니다." },
      ],
      after24h: [
        { title: "수온 상승", description: "24시간 후에도 높은 수온이 유지되어 중문 해변 밀집이 이어집니다." },
        { title: "독성 의심 제보", description: "독성 해파리 잔존으로 쏘임 위험이 계속될 것으로 보입니다." },
      ],
      after72h: [
        { title: "파고 증가", description: "72시간 후 파고가 낮아지며 중문 해변 유입이 점차 줄어듭니다." },
        { title: "과거 출현 이력", description: "사흘 뒤에도 잔존 개체로 인한 위험이 남을 수 있습니다." },
      ],
    },
    alternativeBeachIds: ["hwasun", "woljeong", "hyeopjae", "gimnyeong"],
  },
  {
    id: "hwasun",
    name: "화순금모래 해변",
    address: "제주 서귀포시 안덕면",
    risk: "safe",
    riskScore: 18,
    confidence: 92,
    point: { lat: 33.2383, lng: 126.3348 },
    imageSrc: PLACEHOLDER_IMAGE,
    hourly: [
      currentHourly("safe", 18, 92),
      futureHourly("after24h", 24, 93, "caution"),
      futureHourly("after72h", 16, 91, "safe"),
    ],
    causesByTime: {
      current: [
        { title: "과거 출현 이력", description: "화순 해변은 최근 해파리 신고가 적어 안전하게 이용할 수 있습니다." },
      ],
      after24h: [
        { title: "수온 상승", description: "24시간 후 수온이 잠시 오르며 주의 수준에 근접할 수 있습니다." },
      ],
      after72h: [
        { title: "과거 출현 이력", description: "72시간 후 화순 해변은 다시 안전 수준으로 안정될 전망입니다." },
      ],
    },
    alternativeBeachIds: ["woljeong", "gimnyeong", "hyeopjae", "pyoseon"],
  },
  {
    id: "hyeopjae",
    name: "협재 해수욕장",
    address: "제주 제주시 한림읍",
    risk: "caution",
    riskScore: 51,
    confidence: 95,
    point: { lat: 33.3941, lng: 126.2396 },
    imageSrc: PLACEHOLDER_IMAGE,
    hourly: [
      currentHourly("caution", 51, 95),
      futureHourly("after24h", 58, 94, "caution"),
      futureHourly("after72h", 44, 92, "caution"),
    ],
    causesByTime: {
      current: [
        { title: "수온 상승", description: "협재 해변 수온이 오르며 해파리 출몰 가능성이 생기고 있습니다." },
        { title: "해변 방향 풍향", description: "북서풍이 해변으로 불며 협재 해변에 소량 유입이 관측됩니다." },
      ],
      after24h: [
        { title: "수온 상승", description: "24시간 후 수온 상승이 이어져 협재 해변 주의가 지속됩니다." },
        { title: "과거 출현 이력", description: "성수기 협재에서 출현 이력이 있어 관찰이 필요합니다." },
      ],
      after72h: [
        { title: "수온 상승", description: "72시간 후 수온이 안정되며 협재 해변 위험도가 낮아집니다." },
      ],
    },
    alternativeBeachIds: ["woljeong", "hwasun", "gimnyeong"],
  },
  {
    id: "iho",
    name: "이호테우 해수욕장",
    address: "제주 제주시 이호동",
    risk: "danger",
    riskScore: 66,
    confidence: 96,
    point: { lat: 33.4986, lng: 126.4525 },
    imageSrc: PLACEHOLDER_IMAGE,
    hourly: [
      currentHourly("danger", 66, 96),
      futureHourly("after24h", 72, 95, "danger"),
      futureHourly("after72h", 52, 92, "caution"),
    ],
    causesByTime: {
      current: [
        { title: "해변 방향 풍향", description: "해변 방향으로 부는 바람으로 이호테우에 해파리가 유입되고 있습니다." },
        { title: "수온 상승", description: "표층 수온 상승으로 이호테우 해변 해파리 활동이 활발합니다." },
      ],
      after24h: [
        { title: "파고 증가", description: "24시간 후 파고가 높아지며 이호테우 유입 위험이 커집니다." },
        { title: "수온 상승", description: "수온 상승세가 이어져 위험도가 한층 높아질 전망입니다." },
        { title: "과거 출현 이력", description: "이호테우 인근 출현 이력이 있어 각별한 주의가 필요합니다." },
      ],
      after72h: [
        { title: "해변 방향 풍향", description: "72시간 후 풍향이 바뀌며 이호테우 유입이 줄어들 것으로 보입니다." },
      ],
    },
    alternativeBeachIds: ["woljeong", "hwasun", "hyeopjae", "gimnyeong"],
  },
];

export function getBeachById(id: string): BeachDetail | undefined {
  return BEACHES.find((beach) => beach.id === id);
}
