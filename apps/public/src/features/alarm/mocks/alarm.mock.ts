import type { AlertNotification } from "@/features/alarm/types";

// 데모 알림 id는 실제 서버 id(양수)와 충돌하지 않도록 음수를 사용한다.
// 실제 알림이 0건이어도 기능을 이해할 수 있게 항상 아래쪽에 함께 노출한다.
// 서버에 없는 항목이라 탭해도 열람 PATCH를 호출하지 않는다(정적 표시).
export const isDemoAlert = (id: number): boolean => id < 0;

// 해파리 안전 서비스 맥락의 시드 데모 알림. 위험 단계를 섞어 노출한다.
export const DEMO_ALERTS: AlertNotification[] = [
  {
    id: -1,
    beachName: "협재 해수욕장",
    risk: "critical",
    title: "해파리 대량 출몰, 입수를 중단해 주세요",
    message:
      "협재 해수욕장 인근에서 노무라입깃해파리가 대량으로 관측되었습니다. 안전요원의 안내에 따라 즉시 입수를 중단해 주세요.",
    notifiedAt: "2026.07.13 15:20",
    isRead: false,
  },
  {
    id: -2,
    beachName: "함덕 해수욕장",
    risk: "danger",
    title: "해파리 출몰 위험이 높아졌습니다",
    message:
      "수온 상승으로 해파리 출몰 위험이 높습니다. 어린이와 노약자는 입수를 자제하고 물놀이 시 각별히 주의해 주세요.",
    notifiedAt: "2026.07.12 09:05",
    isRead: false,
  },
  {
    id: -3,
    beachName: "이호테우 해수욕장",
    risk: "caution",
    title: "해파리 출몰 가능성 주의보",
    message:
      "이호테우 해수욕장 주변에서 소량의 해파리가 관측되었습니다. 입수 전 주변을 살피고 안전요원의 안내를 따라 주세요.",
    notifiedAt: "2026.07.10 18:42",
    isRead: true,
  },
  {
    id: -4,
    beachName: "중문색달 해수욕장",
    risk: "safe",
    title: "해파리 위험도가 안전 단계로 회복되었습니다",
    message:
      "관측 결과 해파리 위험도가 안전 단계로 낮아졌습니다. 실시간 상황에 따라 변동될 수 있으니 안내 사항을 확인해 주세요.",
    notifiedAt: "2026.07.08 11:30",
    isRead: true,
  },
];
