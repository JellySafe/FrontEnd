"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// 서버 상태 관리 Provider. QueryClient는 요청/탭 간 공유되지 않도록 클라이언트에서 1회 생성.
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 목록/상세가 자주 바뀌지 않으므로 짧게 신선도 유지, 재조회 최소화
            staleTime: 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
