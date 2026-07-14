"use client";

import { Button, Skeleton } from "@jellysafe/design-system";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { JEJU_CENTER, JEJU_OVERVIEW_LEVEL } from "@/shared/map/constants";
import { KakaoMapCanvas } from "@/shared/map/KakaoMapCanvas";
import { useDashboardData } from "../api/useDashboardData";
import { EMPTY_FILTER, countActiveFilters } from "../types";
import type {
  BeachSummary,
  DashboardFilterState,
  RiskLevel,
  TimeFrame,
} from "../types";
import { useMarkerLabelVisibility } from "../hooks/useMarkerLabelVisibility";
import { panToAvoidPanel } from "../utils/panToAvoidPanel";
import { DashboardDetailPanel } from "./DashboardDetailPanel";
import { DashboardFilters } from "./DashboardFilters";
import { DashboardList } from "./DashboardList";
import { DashboardMapMarker } from "./DashboardMapMarker";
import { DashboardMapOverlay } from "./DashboardMapOverlay";
import { DashboardStats } from "./DashboardStats";

function matchesFilter(
  beach: BeachSummary,
  filter: DashboardFilterState,
  query: string,
): boolean {
  if (filter.risks.length > 0 && !filter.risks.includes(beach.risk)) {
    return false;
  }
  if (filter.unidentified !== null && beach.hasUnidentifiedReport !== filter.unidentified) {
    return false;
  }
  const trimmed = query.trim();
  if (trimmed && !beach.name.includes(trimmed) && !beach.address.includes(trimmed)) {
    return false;
  }
  return true;
}

function DashboardStatsSkeleton() {
  return (
    <section className="flex flex-col gap-(--gap-3)">
      <div className="flex flex-col gap-(--gap-2)">
        <Skeleton className="h-[27px] w-[180px] rounded-md" />
        <Skeleton className="h-[21px] w-[140px] rounded-md" />
      </div>
      <div className="grid grid-cols-5 gap-(--gap-4)">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton className="h-[158px] rounded-2xl" key={index} />
        ))}
      </div>
    </section>
  );
}

// 목록 + 지도 자리 스켈레톤 (로딩 문구 대체)
function DashboardMapSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-[453px] min-w-0 flex-1"
      role="status"
    >
      <span className="sr-only">현황을 불러오는 중</span>
      <div className="flex h-full w-[413px] shrink-0 flex-col gap-(--gap-3) pr-(--padding-6)">
        <Skeleton className="h-[42px] w-full rounded-lg" />
        <Skeleton className="ml-auto h-[21px] w-[64px] rounded-md" />
        <div className="flex min-h-0 flex-1 flex-col gap-(--gap-2)">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-[107px] w-full rounded-lg" key={index} />
          ))}
        </div>
      </div>
      <Skeleton className="min-h-0 min-w-0 flex-1 rounded-2xl" />
    </div>
  );
}

export function DashboardView() {
  const [query, setQuery] = useState("");
  const [appliedFilter, setAppliedFilter] = useState<DashboardFilterState>(EMPTY_FILTER);
  const [draftFilter, setDraftFilter] = useState<DashboardFilterState>(EMPTY_FILTER);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  const {
    beaches,
    stats,
    timestamp,
    isLoading,
    isRefreshing,
    isError,
    refresh,
    horizon,
    getBeachDetail,
  } = useDashboardData(appliedFilter.time);

  const listScrollRef = useRef<HTMLDivElement | null>(null);
  const listItemRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  const visibleBeaches = useMemo(
    () => beaches.filter((beach) => matchesFilter(beach, appliedFilter, query)),
    [beaches, appliedFilter, query],
  );

  const labelVisibleIds = useMarkerLabelVisibility(map, visibleBeaches, selectedId);
  const previewCount = useMemo(
    () => beaches.filter((beach) => matchesFilter(beach, draftFilter, query)).length,
    [beaches, draftFilter, query],
  );

  const selectedBeach = visibleBeaches.find((beach) => beach.id === selectedId) ?? null;
  const detail = selectedBeach ? getBeachDetail(selectedBeach) : null;

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    const container = listScrollRef.current;
    const item = listItemRefs.current.get(id);
    if (container && item) {
      container.scrollTo({ top: item.offsetTop - container.offsetTop, behavior: "smooth" });
    }
  }, []);

  // pan은 한 번만: 선택 + 지도 ready 시. handleSelect와 중복 호출하면 pan 중 왼쪽이 잘려 보인다.
  useEffect(() => {
    if (!map || !selectedBeach) return;
    panToAvoidPanel(map, selectedBeach.point);
  }, [map, selectedBeach]);

  const toggleFilter = () => {
    if (isFilterOpen) {
      setIsFilterOpen(false);
      return;
    }
    setDraftFilter(appliedFilter);
    setIsFilterOpen(true);
  };
  const toggleRisk = (risk: RiskLevel) =>
    setDraftFilter((prev) => ({
      ...prev,
      risks: prev.risks.includes(risk)
        ? prev.risks.filter((item) => item !== risk)
        : [...prev.risks, risk],
    }));
  const setTime = (time: TimeFrame) =>
    setDraftFilter((prev) => ({ ...prev, time: prev.time === time ? null : time }));
  const setUnidentified = (value: boolean) =>
    setDraftFilter((prev) => ({
      ...prev,
      unidentified: prev.unidentified === value ? null : value,
    }));
  const resetDraft = () => setDraftFilter(EMPTY_FILTER);
  const applyFilter = () => {
    setAppliedFilter(draftFilter);
    setIsFilterOpen(false);
    setSelectedId(null);
  };

  const fitPoints = beaches.length > 0 ? beaches.map((beach) => beach.point) : undefined;

  if (isError) {
    return (
      <div className="flex h-full min-h-0 flex-col items-center justify-center pt-(--padding-8)">
        <p className="text-body-xsmall-pc text-text-tertiary">현황을 불러오지 못했습니다</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-(--gap-8) pt-(--padding-8)">
      {isLoading && stats.length === 0 ? (
        <DashboardStatsSkeleton />
      ) : (
        <DashboardStats
          isRefreshing={isRefreshing}
          onRefresh={refresh}
          stats={stats}
          timestamp={timestamp}
          title="제주도 해파리 현황"
        />
      )}

      <section className="flex min-h-0 flex-1 flex-col gap-(--gap-4)">
        <h2 className="text-heading-xsmall-pc text-text-primary">위험도 지도</h2>
        <div className="flex min-h-[453px] min-w-0 flex-1">
          {isLoading && beaches.length === 0 ? (
            <DashboardMapSkeleton />
          ) : (
            <>
              <DashboardList
                beaches={visibleBeaches}
                itemRefs={listItemRefs}
                onQueryChange={setQuery}
                onSelect={handleSelect}
                query={query}
                scrollContainerRef={listScrollRef}
                selectedId={selectedId}
                totalCount={visibleBeaches.length}
              />
              <div className="relative min-w-0 flex-1">
                <KakaoMapCanvas
                  center={JEJU_CENTER}
                  fitPoints={fitPoints}
                  key={`${horizon}-${beaches.length}`}
                  level={JEJU_OVERVIEW_LEVEL}
                  onMapCreate={setMap}
                >
                  {visibleBeaches.map((beach) => (
                    <DashboardMapMarker
                      beach={beach}
                      key={beach.id}
                      onSelect={handleSelect}
                      selected={beach.id === selectedId}
                      showLabel={beach.id === selectedId || labelVisibleIds.has(beach.id)}
                    />
                  ))}
                </KakaoMapCanvas>
                <DashboardMapOverlay />
                <DashboardFilters
                  appliedCount={countActiveFilters(appliedFilter)}
                  canReset={countActiveFilters(draftFilter) > 0}
                  draft={draftFilter}
                  isOpen={isFilterOpen}
                  onApply={applyFilter}
                  onReset={resetDraft}
                  onSetTime={setTime}
                  onSetUnidentified={setUnidentified}
                  onToggle={toggleFilter}
                  onToggleRisk={toggleRisk}
                  previewCount={previewCount}
                />
                {selectedBeach && detail ? (
                  <DashboardDetailPanel detail={detail} onClose={() => setSelectedId(null)} />
                ) : selectedBeach ? (
                  <div className="absolute top-[16px] bottom-[16px] left-[16px] z-40 w-[400px] overflow-hidden">
                    <div className="animate-panel-slide-up flex h-full flex-col items-center justify-center gap-(--gap-4) rounded-lg bg-bg-default p-(--padding-7) shadow-[0_0_4px_var(--color-alpha-black-5)]">
                      <p className="text-body-xsmall-pc text-text-tertiary">위험도 상세를 불러오지 못했습니다</p>
                      <Button onClick={() => setSelectedId(null)} platform="pc" size="medium" type="button" variant="secondary">
                        닫기
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
