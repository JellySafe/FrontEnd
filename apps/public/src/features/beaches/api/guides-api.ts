import { getJson } from "@/shared/api/http-client";
import type { PublicGuideResponse } from "@/shared/api/types";

export const FIRST_AID_GUIDE_CODE = "FIRST_AID";

// GET /api/public/guides — 공개/관리 안내문 목록
export function getPublicGuides(): Promise<PublicGuideResponse[]> {
  return getJson<PublicGuideResponse[]>("/api/public/guides");
}

// 응급 대처법(FIRST_AID) 한 건. 없으면 null.
export async function getFirstAidGuide(): Promise<PublicGuideResponse | null> {
  const guides = await getPublicGuides();
  return guides.find((guide) => guide.guideCode === FIRST_AID_GUIDE_CODE) ?? null;
}
