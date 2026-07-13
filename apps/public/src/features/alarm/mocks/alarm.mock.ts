import type { RiskLevel } from "@/shared/risk/types";

// 알림 화면용 mock. beachId는 공유 BEACHES의 실제 id를 참조한다.
export type AlarmNotification = {
  id: string;
  beachId: string;
  risk: RiskLevel;
  title: string;
  description: string;
  notifiedAt: string;
};

// 최신순 정렬된 알림 목록(Figma 문구 재사용 + 변형)
export const ALARM_NOTIFICATIONS: AlarmNotification[] = [
  {
    id: "alarm-1",
    beachId: "samyang",
    risk: "critical",
    title: "입수 자제를 권고합니다",
    description:
      "해파리 출몰 위험이 매우 높습니다.\n안전을 위해 입수를 자제해 주시기 바랍니다.",
    notifiedAt: "2026.02.07 21:47",
  },
  {
    id: "alarm-2",
    beachId: "hamdeok",
    risk: "danger",
    title: "위험도가 상승했습니다",
    description:
      "주의 단계에서 위험 단계로 변경되었습니다.\n해변 이용 전 최신 위험도를 확인하고 입수 시 각별히 주의해 주세요.",
    notifiedAt: "2026.02.07 18:12",
  },
  {
    id: "alarm-3",
    beachId: "jungmun",
    risk: "critical",
    title: "입수 자제를 권고합니다",
    description:
      "해파리 출몰 위험이 매우 높습니다.\n안전을 위해 입수를 자제해 주시기 바랍니다.",
    notifiedAt: "2026.02.06 14:03",
  },
  {
    id: "alarm-4",
    beachId: "gimnyeong",
    risk: "caution",
    title: "현장 안전 안내",
    description:
      "관리자가 해파리 출몰 가능성을 확인했습니다.\n안전요원의 안내를 따라 안전하게 해변을 이용해 주세요.",
    notifiedAt: "2026.02.05 09:36",
  },
  {
    id: "alarm-5",
    beachId: "seongsan",
    risk: "danger",
    title: "위험도가 상승했습니다",
    description:
      "주의 단계에서 위험 단계로 변경되었습니다.\n해변 이용 전 최신 위험도를 확인하고 입수 시 각별히 주의해 주세요.",
    notifiedAt: "2026.02.04 20:21",
  },
  {
    id: "alarm-6",
    beachId: "hyeopjae",
    risk: "caution",
    title: "현장 안전 안내",
    description:
      "관리자가 해파리 출몰 가능성을 확인했습니다.\n안전요원의 안내를 따라 안전하게 해변을 이용해 주세요.",
    notifiedAt: "2026.02.03 11:58",
  },
];
