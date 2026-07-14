import type { AlertEventType, AlertListItemResponse } from "@/shared/api/types";
import { toRiskLevel } from "@/shared/risk/mappers";
import { formatNotifiedAt } from "../utils/format-notified-at";
import type { AlertNotification } from "../types";

// 해변명이 없을 때 대체 문구
const FALLBACK_BEACH_NAME = "제주 해변";

// title이 null일 때 eventType 기반 폴백 문구(한국어)
const EVENT_TYPE_TITLE_FALLBACK: Record<AlertEventType, string> = {
  level_up: "위험도가 상승했습니다",
  toxic_report: "독성 해파리 의심 제보가 접수되었습니다",
  sting_report: "해파리 쏘임 사고 제보가 접수되었습니다",
};

// 알림 목록 항목 매핑. riskLevel이 null이면 Badge 표시를 생략하기 위해 null 유지.
export function toAlertNotification(dto: AlertListItemResponse): AlertNotification {
  return {
    id: dto.notificationId,
    beachName: dto.beachName ?? FALLBACK_BEACH_NAME,
    risk: dto.riskLevel ? toRiskLevel(dto.riskLevel) : null,
    title: dto.title ?? EVENT_TYPE_TITLE_FALLBACK[dto.eventType],
    message: dto.message,
    notifiedAt: formatNotifiedAt(dto.createdAt),
    isRead: dto.readAt != null,
  };
}
