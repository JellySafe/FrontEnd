// 제보 관련 쿼리 키 팩토리
export const reportKeys = {
  all: ["report"] as const,
  result: (id: number) => [...reportKeys.all, "result", id] as const,
};
