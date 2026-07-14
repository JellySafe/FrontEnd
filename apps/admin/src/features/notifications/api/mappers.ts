import type { AdminNotificationListItemResponse } from "@/shared/api/types";
import type { BackendRiskLevel } from "@/shared/api/types";
import { formatDateTime, toRiskLevel } from "@/shared/risk/mappers";
import type { RiskLevel } from "@/shared/risk/types";
import type { NotificationItem } from "../types";

export function toNotificationItem(dto: AdminNotificationListItemResponse): NotificationItem {
  return {
    id: String(dto.notificationId),
    locationLabel: dto.beachName ?? "위치 미정",
    title: dto.title ?? "(제목 없음)",
    body: dto.message,
    createdAt: formatDateTime(dto.createdAt),
    risk: dto.riskLevel ? toRiskLevel(dto.riskLevel) : "safe",
    isUnread: dto.readAt === null,
  };
}

export function toBackendRiskLevel(risk: RiskLevel): BackendRiskLevel {
  return risk === "critical" ? "severe" : risk;
}

export function buildBackendRiskByBeachId(
  items: { beachId: number; riskLevel: BackendRiskLevel }[],
): Map<number, BackendRiskLevel> {
  return new Map(items.map((item) => [item.beachId, item.riskLevel]));
}
