import { useQuery } from "@tanstack/react-query";
import type { ReportResultResponse } from "@/shared/api/types";
import { getReportResult } from "./reports-api";
import { isTerminalStatus } from "./mappers";
import { reportKeys } from "./query-keys";

// 폴링 간격(ms). 종결 상태에 도달하면 폴링 중단.
const POLL_INTERVAL_MS = 2000;

// reportId가 있을 때만 활성화되는 제보 결과 폴링 쿼리.
export function useReportResultPolling(reportId: number | null) {
  return useQuery({
    // reportId가 null이면 enabled=false라 실제 조회는 일어나지 않지만,
    // queryKey는 항상 안정적인 값이 필요하므로 -1을 자리표시자로 사용.
    queryKey: reportKeys.result(reportId ?? -1),
    queryFn: () => {
      // enabled로 null 케이스가 차단되지만, 시그니처 만족과 타입 안전을 위해 방어.
      if (reportId === null) {
        throw new Error("reportId가 없어 결과를 조회할 수 없습니다.");
      }
      return getReportResult(reportId);
    },
    enabled: reportId !== null,
    // 최신 데이터가 종결 상태면 폴링 중단, 아니면 2초 간격 유지.
    refetchInterval: (query) => {
      const data: ReportResultResponse | undefined = query.state.data;
      if (data && isTerminalStatus(data.status)) return false;
      return POLL_INTERVAL_MS;
    },
  });
}
