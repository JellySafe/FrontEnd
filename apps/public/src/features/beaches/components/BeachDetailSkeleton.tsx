import { Skeleton } from "@jellysafe/design-system";
import { PUBLIC_APP_MAX_WIDTH_CLASS } from "@/shared/ui/public-layout";

/** 해변 상세 로딩 스켈레톤 — 헤더·배너·차트·원인 영역 자리 표시 */
export function BeachDetailSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className={`relative ${PUBLIC_APP_MAX_WIDTH_CLASS} bg-bg-default pb-[var(--padding-8)]`}
      role="status"
    >
      <span className="absolute size-px overflow-hidden whitespace-nowrap">
        해변 정보를 불러오는 중
      </span>

      <header className="flex items-center gap-[var(--gap-3)] px-[var(--padding-5)] py-[var(--padding-4)]">
        <Skeleton className="size-6 shrink-0 rounded-md" />
        <Skeleton className="h-7 w-28 rounded-md" />
        <Skeleton className="h-6 w-12 rounded-full" />
        <Skeleton className="ml-auto size-6 shrink-0 rounded-md" />
      </header>

      <div className="flex flex-col gap-[var(--gap-7)] px-[var(--padding-5)] pt-[var(--gap-6)]">
        <Skeleton className="h-14 w-full rounded-2xl" />

        <section className="flex flex-col gap-[var(--gap-3)]">
          <Skeleton className="h-6 w-36 rounded-md" />
          <Skeleton className="h-[220px] w-full rounded-2xl" />
        </section>

        <section className="flex flex-col gap-[var(--gap-3)]">
          <Skeleton className="h-6 w-28 rounded-md" />
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </section>

        <section className="flex flex-col gap-[var(--gap-3)]">
          <Skeleton className="h-6 w-44 rounded-md" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </section>
      </div>
    </main>
  );
}
