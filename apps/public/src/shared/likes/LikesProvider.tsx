"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import type { FavoriteListItemResponse } from "@/shared/api/types";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/shared/likes/favorites-api";
import { favoritesQueryKeys } from "@/shared/likes/query-keys";
import { toRiskLevelSafe } from "@/shared/risk/mappers";
import type { RiskLevel } from "@/shared/risk/types";
import { getAnonymousToken } from "@/shared/token/anonymous-token";

// 관심 탭 렌더용으로 서버 응답을 축약한 형태
export type FavoriteLikePlace = {
  id: string; // String(beachId)
  name: string; // beachName
  region: string; // region
  risk: RiskLevel; // toRiskLevelSafe(currentRiskLevel)
};

type LikesContextValue = {
  likedIds: Set<string>;
  isLiked: (id: string) => boolean;
  toggleLike: (id: string) => void;
  favorites: FavoriteLikePlace[];
  isLoading: boolean;
  isError: boolean;
};

const LikesContext = createContext<LikesContextValue | null>(null);

// useSyncExternalStore용 no-op 구독자(토큰은 localStorage에 고정이라 변경 통지 불필요)
const subscribeNoop = () => () => {};

// 서버 응답을 관심 탭용 형태로 매핑(정렬은 서버 순서 유지)
function toFavoritePlaces(
  items: FavoriteListItemResponse[],
): FavoriteLikePlace[] {
  return items.map((item) => ({
    id: String(item.beachId),
    name: item.beachName,
    region: item.region,
    risk: toRiskLevelSafe(item.currentRiskLevel),
  }));
}

export function LikesProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // 하이드레이션 안전: 익명 토큰은 클라이언트에서만 읽는다.
  // 서버 스냅샷은 빈 문자열이라 SSR 마크업과 일치하고, mount 후 실제 토큰으로 전환된다.
  const token = useSyncExternalStore(
    subscribeNoop,
    () => getAnonymousToken(),
    () => "",
  );

  const favoritesQueryKey = favoritesQueryKeys.list(token);

  const { data, isLoading, isError } = useQuery({
    queryKey: favoritesQueryKey,
    queryFn: () => getFavorites(token),
    // 토큰이 준비되기 전에는 요청하지 않는다
    enabled: token !== "",
  });

  // 서버 목록에서 파생. 토큰/데이터 없으면 빈 값
  const likedIds = useMemo<Set<string>>(() => {
    if (token === "" || data === undefined) return new Set();
    return new Set(data.map((item) => String(item.beachId)));
  }, [token, data]);

  const favorites = useMemo<FavoriteLikePlace[]>(() => {
    if (token === "" || data === undefined) return [];
    return toFavoritePlaces(data);
  }, [token, data]);

  const isLiked = useCallback((id: string) => likedIds.has(id), [likedIds]);

  // 낙관적 갱신 스냅샷 타입
  type FavoritesSnapshot = FavoriteListItemResponse[] | undefined;

  // 관심 등록: 목록에 없을 때만 임시 항목 추가
  const addMutation = useMutation({
    mutationFn: (beachId: number) => addFavorite(beachId, token),
    onMutate: async (beachId: number) => {
      await queryClient.cancelQueries({ queryKey: favoritesQueryKey });
      const previous =
        queryClient.getQueryData<FavoriteListItemResponse[]>(favoritesQueryKey);
      queryClient.setQueryData<FavoriteListItemResponse[]>(
        favoritesQueryKey,
        (current) => {
          const list = current ?? [];
          if (list.some((item) => item.beachId === beachId)) return list;
          // 서버값을 모르는 필드는 최소값으로 채우고 onSettled 무효화로 교정
          const placeholder: FavoriteListItemResponse = {
            favoriteId: -beachId,
            beachId,
            beachName: "",
            region: "",
            currentRiskLevel: null,
            currentRiskScore: null,
            createdAt: new Date().toISOString(),
          };
          return [...list, placeholder];
        },
      );
      return { previous } as { previous: FavoritesSnapshot };
    },
    onError: (_error, _beachId, context) => {
      queryClient.setQueryData(favoritesQueryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: favoritesQueryKey });
    },
  });

  // 관심 해제: 해당 beachId 항목 제거
  const removeMutation = useMutation({
    mutationFn: (beachId: number) => removeFavorite(beachId, token),
    onMutate: async (beachId: number) => {
      await queryClient.cancelQueries({ queryKey: favoritesQueryKey });
      const previous =
        queryClient.getQueryData<FavoriteListItemResponse[]>(favoritesQueryKey);
      queryClient.setQueryData<FavoriteListItemResponse[]>(
        favoritesQueryKey,
        (current) => (current ?? []).filter((item) => item.beachId !== beachId),
      );
      return { previous } as { previous: FavoritesSnapshot };
    },
    onError: (_error, _beachId, context) => {
      queryClient.setQueryData(favoritesQueryKey, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: favoritesQueryKey });
    },
  });

  const toggleLike = useCallback(
    (id: string) => {
      // 토큰이 없으면 서버 요청 자체가 불가능
      if (token === "") return;
      const beachId = Number(id);
      if (likedIds.has(id)) {
        removeMutation.mutate(beachId);
      } else {
        addMutation.mutate(beachId);
      }
    },
    [token, likedIds, addMutation, removeMutation],
  );

  const value = useMemo<LikesContextValue>(
    () => ({ likedIds, isLiked, toggleLike, favorites, isLoading, isError }),
    [likedIds, isLiked, toggleLike, favorites, isLoading, isError],
  );

  return <LikesContext.Provider value={value}>{children}</LikesContext.Provider>;
}

export function useLikes(): LikesContextValue {
  const context = useContext(LikesContext);
  if (context === null) {
    throw new Error("useLikes must be used within a LikesProvider");
  }
  return context;
}
