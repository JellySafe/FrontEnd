"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { JEJU_CENTER, JEJU_OVERVIEW_LEVEL } from "@/shared/map/constants";
import { KakaoMapCanvas } from "@/shared/map/KakaoMapCanvas";
import {
  BEACHES,
  DASHBOARD_STATS,
  DASHBOARD_TIMESTAMP,
  getBeachDetail,
} from "../mocks/dashboard.mock";
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

// 표시 데이터를 필터/검색 조건으로 거른다. (시간 필터는 예측 관점 값이라 목록 필터에는 영향 없음)
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

export function DashboardView() {
  const [query, setQuery] = useState("");
  const [appliedFilter, setAppliedFilter] = useState<DashboardFilterState>(EMPTY_FILTER);
  const [draftFilter, setDraftFilter] = useState<DashboardFilterState>(EMPTY_FILTER);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  // 리스트 스크롤 동기화용 ref
  const listScrollRef = useRef<HTMLDivElement | null>(null);
  const listItemRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  const visibleBeaches = useMemo(
    () => BEACHES.filter((beach) => matchesFilter(beach, appliedFilter, query)),
    [appliedFilter, query],
  );

  // 라벨 겹침 처리(선택 핀 제외, 최고 riskScore 1개만 표시)
  const labelVisibleIds = useMarkerLabelVisibility(map, visibleBeaches, selectedId);
  const previewCount = useMemo(
    () => BEACHES.filter((beach) => matchesFilter(beach, draftFilter, query)).length,
    [draftFilter, query],
  );

  const selectedBeach = visibleBeaches.find((beach) => beach.id === selectedId) ?? null;
  const detail = selectedBeach ? getBeachDetail(selectedBeach) : null;

  // 핀/리스트 선택 공통 처리: 선택 후 패널 회피 이동 + 리스트 스크롤 동기화
  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id);
      const beach = BEACHES.find((item) => item.id === id);
      if (map && beach) {
        panToAvoidPanel(map, beach.point);
      }
      // 해당 리스트 항목을 스크롤 영역 상단으로 이동
      const container = listScrollRef.current;
      const item = listItemRefs.current.get(id);
      if (container && item) {
        container.scrollTo({ top: item.offsetTop - container.offsetTop, behavior: "smooth" });
      }
    },
    [map],
  );

  // 지도 생성 이후 선택 상태가 있으면 회피 이동을 보정한다.
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

  return (
    <div className="flex h-full min-h-0 flex-col gap-(--gap-8) pt-(--padding-8)">
      <DashboardStats stats={DASHBOARD_STATS} timestamp={DASHBOARD_TIMESTAMP} title="제주도 해파리 현황" />

      <section className="flex min-h-0 flex-1 flex-col gap-(--gap-4)">
        <h2 className="text-heading-xsmall-pc text-text-primary">위험도 지도</h2>
        <div className="flex min-h-[453px] min-w-0 flex-1">
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
            {/* 마커만 지도 children으로 렌더하고, 범례/필터/패널은 지도 위 형제로 유지한다. */}
            <KakaoMapCanvas
              center={JEJU_CENTER}
              fitPoints={BEACHES.map((beach) => beach.point)}
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
            {detail ? (
              <DashboardDetailPanel detail={detail} onClose={() => setSelectedId(null)} />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
