import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAlertRead } from "./alerts-api";
import { alertsQueryKeys } from "./query-keys";

// 알림 열람 처리 mutation. 성공 시 알림 목록 전체를 무효화해 미열람 상태를 갱신한다.
export function useMarkAlertReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => markAlertRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alertsQueryKeys.all });
    },
  });
}
