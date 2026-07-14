import { Skeleton } from "@jellysafe/design-system";

/** 제보 상세 로딩 스켈레톤 — TipOffDetailPanel 레이아웃 자리 표시 */
export function TipOffDetailLoadingSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="relative flex flex-col gap-(--gap-8)"
      role="status"
    >
      <span className="absolute size-px overflow-hidden whitespace-nowrap">
        제보 상세를 불러오는 중
      </span>

      <div className="grid grid-cols-1 gap-(--gap-3) xl:grid-cols-[514px_minmax(0,1fr)]">
        <div className="flex flex-col gap-(--gap-3)">
          <Skeleton className="h-7 w-12 rounded-md" />
          <Skeleton className="h-[385px] w-full rounded-2xl" />
        </div>
        <div className="flex flex-col gap-(--gap-3)">
          <Skeleton className="h-7 w-12 rounded-md" />
          <Skeleton className="h-[385px] w-full rounded-2xl" />
        </div>
      </div>

      <div className="flex flex-col gap-(--gap-3)">
        <Skeleton className="h-7 w-20 rounded-md" />
        <Skeleton className="h-5 w-32 rounded-md" />
      </div>

      <div className="flex flex-col gap-(--gap-3)">
        <div className="flex flex-wrap items-center gap-(--gap-2)">
          <Skeleton className="h-7 w-28 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
        <Skeleton className="h-5 w-40 rounded-md" />
      </div>

      <section className="flex flex-col gap-(--gap-8)">
        <div className="flex flex-col gap-(--gap-3)">
          <Skeleton className="h-7 w-20 rounded-md" />
          <Skeleton className="h-4 w-48 rounded-md" />
          <div className="flex flex-wrap gap-(--gap-2)">
            <Skeleton className="h-9 w-16 rounded-full" />
            <Skeleton className="h-9 w-16 rounded-full" />
            <Skeleton className="h-9 w-16 rounded-full" />
          </div>
        </div>
      </section>

      <Skeleton className="h-12 w-full rounded-2xl" />
    </div>
  );
}
