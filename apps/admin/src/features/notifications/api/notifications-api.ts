import { getJson, postJson } from "@/shared/api/http-client";
import type {
  AdminNotificationListItemResponse,
  PaginatedResponse,
  SendNotificationRequest,
  SendNotificationResponse,
} from "@/shared/api/types";

export type GetAdminNotificationsParams = { page?: number; size?: number };

export function getAdminNotifications(
  params?: GetAdminNotificationsParams,
): Promise<PaginatedResponse<AdminNotificationListItemResponse>> {
  const searchParams = new URLSearchParams({
    page: String(params?.page ?? 1),
    size: String(params?.size ?? 50),
  });
  searchParams.set("_t", String(Date.now()));
  return getJson<PaginatedResponse<AdminNotificationListItemResponse>>(
    `/api/admin/notifications?${searchParams.toString()}`,
    {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    },
  );
}

export function sendNotification(
  body: SendNotificationRequest,
): Promise<SendNotificationResponse> {
  return postJson<SendNotificationResponse>("/api/admin/notifications", body);
}
