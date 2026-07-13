"use client";

import { Badge } from "@jellysafe/design-system";
import { useCallback } from "react";
import { useScrollIndicator } from "@/shared/hooks/useScrollIndicator";
import { ChevronRightIcon, CloseIcon, SearchIcon } from "@/shared/ui/icons";
import { RISK_LABEL } from "../types";
import type { RefObject } from "react";
import type { BeachSummary } from "../types";

export type DashboardListProps = {
  beaches: BeachSummary[];
  totalCount: number;
  query: string;
  onQueryChange: (value: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  // 핀 선택 시 해당 항목으로 스크롤하기 위한 스크롤 컨테이너/항목 ref
  scrollContainerRef?: RefObject<HTMLDivElement | null>;
  itemRefs?: RefObject<Map<string, HTMLLIElement>>;
};

export function DashboardList({
  beaches,
  totalCount,
  query,
  onQueryChange,
  selectedId,
  onSelect,
  scrollContainerRef,
  itemRefs,
}: DashboardListProps) {
  const indicatorRef = useScrollIndicator<HTMLDivElement>();
  // 스크롤 인디케이터 ref와 외부 스크롤 컨테이너 ref를 함께 연결한다.
  const setListRef = useCallback(
    (node: HTMLDivElement | null) => {
      indicatorRef.current = node;
      if (scrollContainerRef) {
        scrollContainerRef.current = node;
      }
    },
    [indicatorRef, scrollContainerRef],
  );

  return (
    <div className="flex h-full w-[413px] shrink-0 flex-col gap-(--gap-3) pr-(--padding-6)">
      <div className="flex items-center gap-(--gap-2) rounded-lg border border-border-default bg-bg-default px-(--padding-4) py-(--padding-3)">
        <input
          aria-label="해변 검색"
          className="min-w-0 flex-1 bg-transparent text-body-xxsmall-pc text-text-tertiary outline-none placeholder:text-text-tertiary"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="검색어를 검색해주세요"
          type="text"
          value={query}
        />
        {query ? (
          <button
            aria-label="검색어 지우기"
            className="text-icon-tertiary"
            onClick={() => onQueryChange("")}
            type="button"
          >
            <CloseIcon className="size-[20px]" />
          </button>
        ) : null}
        <SearchIcon className="size-[24px] text-icon-tertiary" />
      </div>

      <p className="text-right text-caption-medium-pc text-text-tertiary">결과: {totalCount}</p>

      <div className="scrollbar-indicator min-h-0 flex-1 overflow-y-auto" ref={setListRef}>
        {beaches.length === 0 ? (
          <p className="py-(--padding-10) text-center text-caption-small-pc text-text-tertiary">
            검색 결과가 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col">
            {beaches.map((beach) => {
              const isSelected = beach.id === selectedId;
              return (
                <li
                  key={beach.id}
                  ref={(node) => {
                    const map = itemRefs?.current;
                    if (!map) return;
                    if (node) {
                      map.set(beach.id, node);
                    } else {
                      map.delete(beach.id);
                    }
                  }}
                >
                  <button
                    className={[
                      "flex w-full items-start gap-(--gap-3) border-b border-border-default bg-transparent py-(--padding-5) pr-(--padding-3) pl-(--padding-5) text-left hover:bg-transparent",
                      "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-border-brand)]",
                      isSelected ? "bg-bg-surface hover:bg-bg-surface" : "",
                    ].join(" ")}
                    onClick={() => onSelect(beach.id)}
                    type="button"
                  >
                    <Badge className="mt-[2px] shrink-0" status={beach.risk}>
                      {RISK_LABEL[beach.risk]}
                    </Badge>
                    <span className="flex min-w-0 flex-1 flex-col gap-(--gap-2)">
                      <span className="flex flex-wrap items-center gap-[4px]">
                        <span className="truncate text-body-xsmall-pc text-text-primary">
                          {beach.name}
                        </span>
                        <span className="text-caption-small-pc text-text-tertiary">
                          {beach.address}
                        </span>
                      </span>
                      <span className="flex flex-wrap items-start gap-[4px] text-caption-medium-pc">
                        <span className="text-text-secondary">
                          현재 위험도<span className="text-text-tertiary">(신뢰도)</span>: {beach.riskScore}
                          <span className="text-text-tertiary">({beach.confidence}%)</span>
                        </span>
                        <span className="text-text-tertiary">위험 원인: {beach.causeSummary}</span>
                      </span>
                    </span>
                    <ChevronRightIcon className="mt-[2px] size-[24px] shrink-0 text-icon-tertiary" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
