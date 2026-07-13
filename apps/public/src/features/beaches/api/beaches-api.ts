import { getJson } from "@/shared/api/http-client";
import type {
  BeachDetailResponse,
  BeachListItemResponse,
  PublicBeachRiskResponse,
} from "@/shared/api/types";
import { toBeachDetailInfo, toBeachListItem, toBeachRiskInfo } from "./mappers";
import type { BeachDetailInfo, BeachListItem, BeachRiskInfo } from "../types";

// 해변 목록 조회
export async function getBeaches(): Promise<BeachListItem[]> {
  const data = await getJson<BeachListItemResponse[]>("/api/public/beaches");
  return data.map(toBeachListItem);
}

// 해변 상세(마스터) 조회
export async function getBeachDetail(beachId: number): Promise<BeachDetailInfo> {
  const data = await getJson<BeachDetailResponse>(`/api/public/beaches/${beachId}`);
  return toBeachDetailInfo(data);
}

// 해변 현재 시점 위험도 조회
export async function getBeachRisk(beachId: number): Promise<BeachRiskInfo> {
  const data = await getJson<PublicBeachRiskResponse>(`/api/public/beaches/${beachId}/risk`);
  return toBeachRiskInfo(data);
}
