import { getJson, patchJson } from "@/shared/api/http-client";
import type { AlertListResponse, AlertReadResponse } from "@/shared/api/types";
import { toAlertNotification } from "./mappers";
import type { AlertNotification } from "../types";

// 목록 조회 결과. 화면용으로 매핑된 items와 페이지 메타를 함께 반환.
export type AlertListResult = {
  items: AlertNotification[];
  total: number;
  page: number;
  size: number;
};

// 알림 목록 조회. 서버가 미열람 우선·최신순으로 정렬해 반환한다(프론트 재정렬 불필요).
export async function getAlerts(
  token: string,
  page: number,
  size: number,
): Promise<AlertListResult> {
  const query = new URLSearchParams({
    token,
    page: String(page),
    size: String(size),
  });
  const data = await getJson<AlertListResponse>(`/api/public/alerts?${query.toString()}`);
  return {
    items: data.items.map(toAlertNotification),
    total: data.total,
    page: data.page,
    size: data.size,
  };
}

// 알림 열람 처리. 성공 후 목록을 무효화한다(호출 측 mutation에서).
export async function markAlertRead(notificationId: number): Promise<AlertReadResponse> {
  return patchJson<AlertReadResponse>(
    `/api/public/alerts/${notificationId}/read`,
    // 백엔드는 본문 없이 처리하지만 patchJson이 항상 JSON body를 보내므로 빈 객체 전달
    {},
  );
}
