// TanStack Query 쿼리 키 팩토리. 목록을 토큰/페이지/사이즈로 계층 구분.
export const alertsQueryKeys = {
  all: ["alerts"] as const,
  list: (token: string, page: number, size: number) =>
    [...alertsQueryKeys.all, "list", token, page, size] as const,
};
