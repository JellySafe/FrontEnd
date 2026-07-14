import { Skeleton } from "@jellysafe/design-system";

/** 해변 상세 로딩 스켈레톤 — DetailedMapDetail 레이아웃 자리 표시 */
export function DetailedMapLoadingSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="relative flex flex-col gap-(--gap-8) pb-(--padding-10)"
      role="status"
    >
      <span className="absolute size-px overflow-hidden whitespace-nowrap">
        해변 상세 정보를 불러오는 중
      </span>

      <div className="flex flex-wrap items-center gap-(--gap-3)">
        <Skeleton className="h-[21px] w-40 rounded-md" />
        <Skeleton className="h-[20px] w-px rounded-none" />
        <Skeleton className="h-[21px] w-32 rounded-md" />
        <Skeleton className="h-[20px] w-px rounded-none" />
        <Skeleton className="h-[21px] w-36 rounded-md" />
      </div>

      <div className="grid grid-cols-1 gap-(--gap-7) lg:grid-cols-2">
        <section className="flex flex-col gap-(--gap-3)">
          <Skeleton className="h-[27px] w-36 rounded-md" />
          <Skeleton className="h-[337px] w-full rounded-2xl" />
        </section>
        <section className="flex flex-col gap-(--gap-3)">
          <Skeleton className="h-[27px] w-32 rounded-md" />
          <Skeleton className="h-[33px] w-full rounded-2xl" />
          <Skeleton className="h-[296px] w-full rounded-2xl" />
        </section>
      </div>

      <section className="flex flex-col gap-(--gap-4)">
        <Skeleton className="h-[27px] w-24 rounded-md" />
        <ul className="flex flex-col">
          {[0, 1, 2].map((index) => (
            <li
              className={index > 0 ? "border-t border-border-default" : undefined}
              key={index}
            >
              <div className="flex flex-col gap-(--gap-3) p-(--padding-7)">
                <div className="flex items-center gap-(--gap-3)">
                  <Skeleton className="h-[25px] w-14 rounded-sm" />
                  <Skeleton className="h-[24px] min-w-0 flex-1 rounded-md" />
                  <Skeleton className="h-[24px] w-20 shrink-0 rounded-md" />
                </div>
                <Skeleton className="h-[21px] w-full rounded-md" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
