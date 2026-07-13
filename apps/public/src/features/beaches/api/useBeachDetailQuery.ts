import { useQuery } from "@tanstack/react-query";
import { getBeachDetail } from "./beaches-api";
import { beachesQueryKeys } from "./query-keys";

// 해변 상세(마스터) 쿼리. beachId가 유효한 숫자일 때만 실행.
export function useBeachDetailQuery(beachId: number) {
  return useQuery({
    queryKey: beachesQueryKeys.detail(beachId),
    queryFn: () => getBeachDetail(beachId),
    enabled: Number.isFinite(beachId),
  });
}
