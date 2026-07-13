import { useQuery } from "@tanstack/react-query";
import { getBeaches } from "./beaches-api";
import { beachesQueryKeys } from "./query-keys";

// 해변 목록 쿼리. 검색 화면과 대체 해변 계산에서 공용.
export function useBeachesQuery() {
  return useQuery({
    queryKey: beachesQueryKeys.list(),
    queryFn: getBeaches,
  });
}
