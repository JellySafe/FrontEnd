"use client";

import { useEffect, useState } from "react";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { BottomSheet, Button, useScrollIndicator } from "@jellysafe/design-system";
import { SearchField } from "@/shared/ui/SearchField";
import { useDebouncedValue } from "@/features/location/hooks/useDebouncedValue";
import type { ReportLocation } from "../types";
import { SearchIcon, TargetIcon } from "./icons";

const SEARCH_DEBOUNCE_MS = 300;

/** 검색 결과 목록 고정 높이(행 45px×4 + 구분선 3px). 결과는 이 안에서만 스크롤 */
const ADDRESS_LIST_HEIGHT_CLASS = "h-[183px]";

// place_name에서 검색어 매칭 구간만 브랜드 색으로 강조
function HighlightedName({ name, query }: { name: string; query: string }) {
  const matchIndex = name.toLowerCase().indexOf(query.toLowerCase());
  if (query.length === 0 || matchIndex === -1) {
    return <span className="text-text-primary">{name}</span>;
  }
  const before = name.slice(0, matchIndex);
  const matched = name.slice(matchIndex, matchIndex + query.length);
  const after = name.slice(matchIndex + query.length);
  return (
    <span className="text-text-primary">
      {before}
      <span className="text-text-brand">{matched}</span>
      {after}
    </span>
  );
}

export type AddressSearchSheetProps = {
  open: boolean;
  onClose: () => void;
  /** 완료 시 선택한 위치 */
  onSelect: (location: ReportLocation) => void;
  /** 현재 위치 지도 UI로 전환 */
  onFindCurrentLocation: () => void;
};

/**
 * 발견 위치 주소 시트:
 * 검색 → 현재 위치 → 검색 결과 → 완료
 */
export function AddressSearchSheet({
  open,
  onClose,
  onSelect,
  onFindCurrentLocation,
}: AddressSearchSheetProps) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<kakao.maps.services.PlacesSearchResultItem[]>([]);
  const [pending, setPending] = useState<ReportLocation | null>(null);
  const addressListRef = useScrollIndicator<HTMLUListElement>();
  const debouncedKeyword = useDebouncedValue(keyword, SEARCH_DEBOUNCE_MS);

  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? "",
    libraries: ["services"],
  });
  const isServicesReady =
    !loading && !error && Boolean(process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY);

  // 열릴 때마다 선택 초기화
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setPending(null);
      setKeyword("");
      setResults([]);
    }
  }

  const debouncedQuery = debouncedKeyword.trim();
  // 선택 직후 address를 입력창에 채운 경우에는 재검색하지 않음
  const isLockedToPending = pending !== null && debouncedQuery === pending.address;
  const shouldSearch =
    isServicesReady && debouncedQuery.length > 0 && !isLockedToPending;

  // 검색 조건이 아니면 결과 비움(빈 키워드·선택 직후 잠금)
  if (!shouldSearch && results.length > 0) {
    setResults([]);
  }

  useEffect(() => {
    if (!shouldSearch || !window.kakao?.maps?.services) {
      return;
    }

    let isStale = false;
    const places = new kakao.maps.services.Places();
    places.keywordSearch(
      debouncedQuery,
      (data, status) => {
        if (isStale) return;
        setResults(status === kakao.maps.services.Status.OK ? data : []);
      },
      {
        bounds: new kakao.maps.LatLngBounds(
          new kakao.maps.LatLng(33.1, 126.1),
          new kakao.maps.LatLng(33.62, 127.0),
        ),
      },
    );

    return () => {
      isStale = true;
    };
  }, [debouncedQuery, shouldSearch]);

  const handleClose = () => {
    setKeyword("");
    setResults([]);
    setPending(null);
    onClose();
  };

  const handlePickSearchResult = (place: kakao.maps.services.PlacesSearchResultItem) => {
    const selected = {
      name: place.place_name,
      address: place.road_address_name || place.address_name,
      point: { lat: Number(place.y), lng: Number(place.x) },
    };
    setPending(selected);
    setKeyword(selected.address);
  };

  const handleConfirm = () => {
    if (!pending) return;
    onSelect(pending);
    handleClose();
  };

  const query = keyword.trim();
  const showingSearch = query.length > 0 && !(pending !== null && query === pending.address);

  return (
    <BottomSheet
      footer={
        <Button
          className="w-full"
          disabled={!pending}
          onClick={handleConfirm}
          platform="mobile"
          variant="primary"
        >
          완료
        </Button>
      }
      onClose={handleClose}
      open={open}
      title="주소를 선택해주세요"
    >
      <div className="flex flex-col gap-(--gap-3)">
        <SearchField
          onValueChange={setKeyword}
          placeholder="주소를 입력해주세요"
          trailing={<SearchIcon className="size-[var(--icon-size-24)] text-icon-secondary" />}
          value={keyword}
        />

        <Button
          className="w-full gap-(--gap-2)"
          onClick={onFindCurrentLocation}
          platform="mobile"
          variant="tertiary"
        >
          <span>현재 위치로 주소 찾기</span>
          <TargetIcon height={20} width={20} />
        </Button>

        <ul
          className={`scrollbar-indicator ${ADDRESS_LIST_HEIGHT_CLASS} overflow-y-auto overscroll-y-contain`}
          ref={addressListRef}
        >
          {showingSearch
            ? results.map((place, index) => {
                const selected = pending?.name === place.place_name;
                return (
                  <li key={place.id}>
                    <button
                      aria-pressed={selected}
                      className={[
                        "flex w-full bg-transparent px-(--padding-5) py-(--padding-4) text-left text-body-xsmall-mobile hover:bg-transparent active:bg-transparent",
                        index < results.length - 1 ? "border-b border-border-default" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => handlePickSearchResult(place)}
                      type="button"
                    >
                      <HighlightedName name={place.place_name} query={query} />
                    </button>
                  </li>
                );
              })
            : null}
        </ul>
      </div>
    </BottomSheet>
  );
}
