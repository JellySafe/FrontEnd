import { deleteVoid, getJson, postJson } from "@/shared/api/http-client";
import type {
  FavoriteCreateResponse,
  FavoriteListItemResponse,
} from "@/shared/api/types";

// 익명 토큰 기준 관심 해변 목록 조회
export async function getFavorites(
  token: string,
): Promise<FavoriteListItemResponse[]> {
  return getJson<FavoriteListItemResponse[]>(
    `/api/public/favorites?token=${encodeURIComponent(token)}`,
  );
}

// 관심 해변 등록
export async function addFavorite(
  beachId: number,
  token: string,
): Promise<FavoriteCreateResponse> {
  return postJson<FavoriteCreateResponse>("/api/public/favorites", {
    beachId,
    userToken: token,
  });
}

// 관심 해변 해제
export async function removeFavorite(
  beachId: number,
  token: string,
): Promise<void> {
  return deleteVoid(
    `/api/public/favorites/${beachId}?token=${encodeURIComponent(token)}`,
  );
}
