import type { RiskLevel } from "@/shared/risk/types";

// 알림 화면용 도메인 타입. 서버 DTO를 매퍼에서 이 형태로 변환한다.
export type AlertNotification = {
  id: number;
  // 해변명. 서버가 null이면 매퍼에서 대체 문구로 채운다.
  beachName: string;
  // riskLevel이 null이면 Badge를 숨기기 위해 null 유지
  risk: RiskLevel | null;
  // title이 null이면 매퍼에서 eventType 기반 폴백 문구로 채운다.
  title: string;
  message: string;
  // "2026.02.07 21:47" 형태의 표시 문자열
  notifiedAt: string;
  // readAt이 있으면 열람 처리된 알림
  isRead: boolean;
};
