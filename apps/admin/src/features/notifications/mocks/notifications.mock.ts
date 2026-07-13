import type { NotificationItem } from "../types";

export const INBOX_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    locationLabel: "삼양 해수욕장",
    title: "해파리 출현 주의 알림",
    body: "삼양 해수욕장 인근 해역에서 해파리 다수 출현이 확인되었습니다. 해변 이용객에게 즉시 주의 안내를 진행해주세요.",
    createdAt: "2026.02.07 21:47",
    risk: "critical",
  },
  {
    id: "notif-2",
    locationLabel: "함덕 해수욕장",
    title: "독성 의심 해파리 제보 대응",
    body: "함덕 해수욕장에서 독성 의심 해파리 제보가 접수되었습니다. 현장 확인 후 필요 시 입수 통제를 검토해주세요.",
    createdAt: "2026.02.07 20:15",
    risk: "danger",
  },
  {
    id: "notif-3",
    locationLabel: "중문색달 해수욕장",
    title: "위험 등급 상향 안내",
    body: "중문색달 해수욕장 위험 등급이 심각으로 상향되었습니다. 운영 인력 배치와 안내 방송을 강화해주세요.",
    createdAt: "2026.02.07 18:32",
    risk: "critical",
  },
  {
    id: "notif-4",
    locationLabel: "성산일출봉 해변",
    title: "파고 증가 연계 주의",
    body: "성산일출봉 해변 해역 파고 증가로 해파리 유입 가능성이 높아졌습니다. 관광객 대상 안전 수칙을 안내해주세요.",
    createdAt: "2026.02.07 16:08",
    risk: "danger",
  },
  {
    id: "notif-5",
    locationLabel: "협재 해수욕장",
    title: "야간 순찰 강화 요청",
    body: "협재 해수욕장 인근에서 소규모 해파리 출현이 보고되었습니다. 야간 순찰 및 안내 표지 점검을 요청드립니다.",
    createdAt: "2026.02.07 14:22",
    risk: "caution",
  },
];
