import { Skeleton } from "@jellysafe/design-system";

// PlaceCard와 같은 비율의 카드 자리표시자
function PlaceCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border-default">
      <Skeleton className="h-[120px] w-full rounded-none" />
      <div className="flex flex-col gap-(--gap-3) bg-bg-default px-(--padding-5) pt-(--padding-3) pb-(--padding-5)">
        <Skeleton className="h-6 w-12 rounded-full" />
        <div className="flex w-full flex-col gap-(--gap-2)">
          <Skeleton className="h-4 w-4/5 rounded-md" />
          <Skeleton className="h-3 w-3/5 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// 해변 검색 목록 로딩 스켈레톤(2열 그리드)
export function BeachListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="relative grid grid-cols-2 gap-(--gap-3)"
      role="status"
    >
      <span className="absolute size-px overflow-hidden whitespace-nowrap">
        해변 정보를 불러오는 중
      </span>
      {Array.from({ length: count }, (_, index) => (
        <PlaceCardSkeleton key={index} />
      ))}
    </div>
  );
}
