import { Skeleton } from "@jellysafe/design-system";

/** 제보 목록 로딩 스켈레톤 — TipOffTable 행 자리 표시 */
export function TipOffListLoadingSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="relative flex flex-col gap-(--gap-2)"
      role="status"
    >
      <span className="sr-only">제보 목록을 불러오는 중</span>

      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton className="h-[72px] w-full rounded-lg" key={index} />
      ))}
    </div>
  );
}
