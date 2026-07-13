"use client";

import { Chip, Dropdown } from "@jellysafe/design-system";
import type { DropdownOption } from "@jellysafe/design-system";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLikes } from "@/shared/likes/LikesProvider";
import { useSelectedLocation } from "@/shared/location/SelectedLocationProvider";
import { RISK_LABEL, RISK_ORDER } from "@/shared/risk/types";
import type { MapPoint, RiskLevel } from "@/shared/risk/types";
import { isAlarmTooltipDismissed } from "@/shared/ui/alarm-tooltip-storage";
import { NavigationBar } from "@/shared/ui/NavigationBar";
import { PUBLIC_NAV_ITEMS } from "@/shared/ui/navigation-items";
import { PlaceCard } from "@/shared/ui/PlaceCard";
import { PublicPageShell } from "@/shared/ui/PublicPageShell";
import { SearchField } from "@/shared/ui/SearchField";
import { useBeachesQuery } from "../api/useBeachesQuery";
import { filterBeaches, sortBeaches } from "../utils/sort-beaches";
import type { BeachSortValue } from "../utils/sort-beaches";
import { AlarmTooltip } from "./AlarmTooltip";
import { ChevronDownIcon, CloseIcon, MapPinIcon, SearchIcon } from "./icons";

// 알림 유도 말풍선 문구(2줄)
const ALARM_TOOLTIP_TEXT = "관심 해변을 저장하고\n해파리 출몰 알림을 받아보세요!";

// 홈(해변 검색) 화면 상호작용 전담. 검색/필터/정렬 상태를 보유하고 파생 목록을 렌더.
export function BeachSearchScreen() {
  const { location } = useSelectedLocation();
  const { isLiked, toggleLike } = useLikes();
  const { data: beaches, isLoading, isError } = useBeachesQuery();

  const [keyword, setKeyword] = useState("");
  const [selectedRisks, setSelectedRisks] = useState<Set<RiskLevel>>(() => new Set());
  const [sort, setSort] = useState<BeachSortValue>("riskAsc");
  // 가까운 순 정렬용 위치 원점(설정된 위치가 없을 때 geolocation으로 확보)
  const [geoOrigin, setGeoOrigin] = useState<MapPoint | null>(null);
  // 알림 탭 최초 클릭 전까지만 말풍선 표시(localStorage)
  const [showAlarmTooltip, setShowAlarmTooltip] = useState(false);

  useEffect(() => {
    setShowAlarmTooltip(!isAlarmTooltipDismissed());
  }, []);

  // 가까운 순: 위치 없어도 선택 가능(원점 없으면 기존 순서 유지, Figma와 동일하게 활성 스타일)
  const sortOptions = useMemo<DropdownOption[]>(
    () => [
      { value: "riskAsc", label: "위험도 낮은 순" },
      { value: "riskDesc", label: "위험도 높은 순" },
      { value: "nearest", label: "가까운 순" },
      { value: "liked", label: "관심 순" },
    ],
    [],
  );

  // 검색어/위험도 필터 후 정렬. 좋아요 상태(liked 정렬)도 의존성에 포함.
  const visibleBeaches = useMemo(() => {
    const filtered = filterBeaches(beaches ?? [], { keyword, risks: selectedRisks });
    return sortBeaches(filtered, {
      sort,
      origin: location?.point ?? geoOrigin,
      isLiked,
    });
  }, [beaches, keyword, selectedRisks, sort, location, geoOrigin, isLiked]);

  // 정렬 변경 핸들러. "가까운 순"이면서 원점(설정 위치/geoOrigin)이 모두 없을 때만 위치 권한 요청
  const handleSortChange = (value: string) => {
    const nextSort = value as BeachSortValue;
    if (nextSort !== "nearest" || location || geoOrigin) {
      setSort(nextSort);
      return;
    }
    // geolocation 미지원: 정렬 유지 + 안내
    if (!navigator.geolocation) {
      alert("위치 권한을 허용하면 가까운 순 정렬을 사용할 수 있어요.");
      return;
    }
    // 비동기 권한 요청: 성공 콜백에서만 정렬을 반영, 거부 시 정렬 유지 + 안내
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSort("nearest");
      },
      () => {
        alert("위치 권한을 허용하면 가까운 순 정렬을 사용할 수 있어요.");
      },
    );
  };

  const toggleRisk = (risk: RiskLevel, selected: boolean) => {
    setSelectedRisks((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(risk);
      } else {
        next.delete(risk);
      }
      return next;
    });
  };

  return (
    <PublicPageShell
      showScrollbar={false}
      footer={<NavigationBar activeKey="beaches" items={PUBLIC_NAV_ITEMS} />}
      footerOverlay={
        showAlarmTooltip ? (
          // Figma: nav 기준 top -40px, 가로 중앙(전체 바 기준)
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[40px]">
            <AlarmTooltip className="relative">{ALARM_TOOLTIP_TEXT}</AlarmTooltip>
          </div>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-(--gap-4)">
        {/* 위치 행: 전체가 /location 링크 */}
        <Link
          className="flex items-center gap-(--gap-2) text-body-large-mobile"
          href="/location"
        >
          <MapPinIcon className="text-icon-tertiary" size={20} />
          <span className={location ? "text-text-primary" : "text-text-tertiary"}>
            {location ? location.name : "위치 설정하기"}
          </span>
          <ChevronDownIcon className="text-icon-brand" size={20} />
        </Link>

        {/* 검색 필드 */}
        <SearchField
          onValueChange={setKeyword}
          placeholder="제주도 해변을 입력해주세요"
          trailing={
            <>
              {keyword ? (
                <button
                  aria-label="검색어 지우기"
                  className="flex items-center text-icon-tertiary"
                  onClick={() => setKeyword("")}
                  type="button"
                >
                  <CloseIcon size={24} />
                </button>
              ) : null}
              <SearchIcon className="text-icon-tertiary" size={24} />
            </>
          }
          value={keyword}
        />

        {/* 필터(위험도 Chip)/정렬 행 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-(--gap-2)">
            {RISK_ORDER.map((risk) => (
              <Chip
                key={risk}
                onSelectedChange={(selected) => toggleRisk(risk, selected)}
                selected={selectedRisks.has(risk)}
              >
                {RISK_LABEL[risk]}
              </Chip>
            ))}
          </div>
          <Dropdown
            aria-label="정렬"
            menuClassName="right-0"
            onValueChange={handleSortChange}
            options={sortOptions}
            value={sort}
          />
        </div>

        {/* 서버 상태별 분기: 로딩/에러/빈 결과/목록 */}
        {isLoading ? (
          <p className="py-(--padding-10) text-center text-body-xsmall-mobile text-text-tertiary">
            해변 정보를 불러오는 중입니다
          </p>
        ) : isError ? (
          <p className="py-(--padding-10) text-center text-body-xsmall-mobile text-text-tertiary">
            해변 정보를 불러오지 못했습니다
          </p>
        ) : visibleBeaches.length > 0 ? (
          <div className="grid grid-cols-2 gap-(--gap-3)">
            {visibleBeaches.map((beach) => (
              <PlaceCard
                address={beach.address}
                className="w-full"
                href={`/beaches/${beach.id}`}
                imageAlt={`${beach.name} 사진`}
                imageSrc={beach.imageSrc}
                isLiked={isLiked(beach.id)}
                key={beach.id}
                likeLabel={`${beach.name} 관심 등록`}
                onLikeChange={() => toggleLike(beach.id)}
                status={beach.risk}
                statusLabel={RISK_LABEL[beach.risk]}
                title={beach.name}
              />
            ))}
          </div>
        ) : (
          <p className="py-(--padding-10) text-center text-body-xsmall-mobile text-text-tertiary">
            검색 결과가 없습니다
          </p>
        )}
      </div>
    </PublicPageShell>
  );
}
