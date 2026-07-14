// 관심 해변 쿼리 키. 토큰별로 캐시를 분리한다.
export const favoritesQueryKeys = {
  all: ["favorites"] as const,
  list: (token: string) => ["favorites", token] as const,
};
