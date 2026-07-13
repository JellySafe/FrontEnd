import { Skeleton } from "@jellysafe/design-system";

/** Figma admin/reports/loading (287:8167) 스켈레톤 레이아웃 */
export function ReportLoadingSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="relative flex flex-col gap-(--gap-8)"
      role="status"
    >
      <span className="absolute size-px overflow-hidden whitespace-nowrap">
        리포트 불러오는 중
      </span>

      <div className="flex flex-col gap-(--gap-3)">
        <Skeleton className="h-10 w-20 rounded-2xl" />
        <Skeleton className="h-[104px] w-full rounded-2xl" />
      </div>

      <div className="flex gap-(--gap-3)">
        <Skeleton className="h-[133px] min-w-0 flex-1 rounded-2xl" />
        <Skeleton className="h-[133px] min-w-0 flex-1 rounded-2xl" />
        <Skeleton className="h-[133px] min-w-0 flex-1 rounded-2xl" />
      </div>

      <div className="flex flex-col gap-(--gap-3)">
        <Skeleton className="h-10 w-[99px] rounded-2xl" />
        <Skeleton className="h-[416px] w-full rounded-2xl" />
      </div>

      <div className="flex flex-col gap-(--gap-3)">
        <Skeleton className="h-10 w-[65px] rounded-2xl" />
        <Skeleton className="h-[320px] w-full rounded-2xl" />
      </div>

      <div className="flex flex-col gap-(--gap-3)">
        <Skeleton className="h-10 w-[65px] rounded-2xl" />
        <div className="flex flex-col items-end gap-(--gap-2)">
          <Skeleton className="h-[436px] w-full rounded-2xl" />
          <Skeleton className="h-12 w-[120px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
