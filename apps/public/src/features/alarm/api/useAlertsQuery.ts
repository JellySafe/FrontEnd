import { useQuery } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { getAnonymousToken } from "@/shared/token/anonymous-token";
import { getAlerts } from "./alerts-api";
import { alertsQueryKeys } from "./query-keys";

// 무한스크롤 요구가 없어 1페이지에 넉넉한 size로 단순 로드한다.
export const ALERTS_PAGE = 1;
export const ALERTS_SIZE = 50;

// 외부 스토어 변화가 없으므로 구독은 no-op
const subscribeNoop = () => () => {};

// 알림 목록 쿼리. 익명 토큰은 클라이언트에서만 확보 가능하다.
// 하이드레이션 안전: 서버 스냅샷은 빈 문자열이라 SSR 마크업과 일치하고,
// mount 후 실제 토큰으로 전환되며 토큰 확보 전까지 enabled=false로 요청을 막는다.
export function useAlertsQuery() {
  const token = useSyncExternalStore(
    subscribeNoop,
    () => getAnonymousToken(),
    () => "",
  );

  return useQuery({
    queryKey: alertsQueryKeys.list(token, ALERTS_PAGE, ALERTS_SIZE),
    queryFn: () => getAlerts(token, ALERTS_PAGE, ALERTS_SIZE),
    enabled: token !== "",
  });
}
