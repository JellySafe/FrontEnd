import { getJson } from "@/shared/api/http-client";
import type { AdminBeachItemResponse, PaginatedResponse } from "@/shared/api/types";

export function getAdminBeaches(): Promise<AdminBeachItemResponse[]> {
  const searchParams = new URLSearchParams({ page: "1", size: "100" });
  return getJson<PaginatedResponse<AdminBeachItemResponse>>(
    `/api/admin/beaches?${searchParams.toString()}`,
  ).then((response) => response.items);
}
