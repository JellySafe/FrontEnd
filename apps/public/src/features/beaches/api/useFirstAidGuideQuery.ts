import { useQuery } from "@tanstack/react-query";
import { getFirstAidGuide } from "./guides-api";
import { beachesQueryKeys } from "./query-keys";

// 해파리 응급 대처법(FIRST_AID). 잘 안 바뀌므로 기본 staleTime으로 충분.
export function useFirstAidGuideQuery() {
  return useQuery({
    queryKey: beachesQueryKeys.guidesFirstAid(),
    queryFn: getFirstAidGuide,
  });
}
