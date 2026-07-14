import { useQuery } from "@tanstack/react-query";
import { getBeachRisk } from "./beaches-api";
import { beachesQueryKeys } from "./query-keys";

// 해변 현재 시점 위험도 쿼리. beachId가 유효한 숫자일 때만 실행.
export function useBeachRiskQuery(beachId: number) {
  return useQuery({
    queryKey: beachesQueryKeys.risk(beachId),
    queryFn: () => getBeachRisk(beachId),
    enabled: Number.isFinite(beachId),
  });
}
