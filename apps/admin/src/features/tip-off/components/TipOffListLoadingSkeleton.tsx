import { Skeleton } from "@jellysafe/design-system";

/** 제보 목록 로딩 스켈레톤 — TipOffTable 행 자리 표시 */
export function TipOffListLoadingSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="relative" role="status">
      <span className="sr-only">제보 목록을 불러오는 중</span>

      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          <Skeleton className="h-[40px] w-full rounded-t-lg" />
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton className="h-[158px] w-full" key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
