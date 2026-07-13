// TanStack Query 쿼리 키 팩토리. 목록/상세/위험도를 계층적으로 구분.
export const beachesQueryKeys = {
  all: ["beaches"] as const,
  list: () => [...beachesQueryKeys.all, "list"] as const,
  detail: (beachId: number) => [...beachesQueryKeys.all, "detail", beachId] as const,
  risk: (beachId: number) => [...beachesQueryKeys.all, "risk", beachId] as const,
};
