"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import { Button, useScrollIndicator } from "@jellysafe/design-system";
import { SearchField } from "@/shared/ui/SearchField";
import { PUBLIC_APP_MAX_WIDTH_CLASS } from "@/shared/ui/public-layout";
import { useSelectedLocation } from "@/shared/location/SelectedLocationProvider";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { ChevronLeftIcon, TargetIcon, XIcon } from "./icons";

const SEARCH_DEBOUNCE_MS = 300;

// place_name에서 검색어 매칭 구간만 강조 표시(앞/매치/뒤 3분할).
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
      <span className="font-semibold text-text-brand">{matched}</span>
      {after}
    </span>
  );
}

export function LocationSetupScreen() {
  const router = useRouter();
  const { setLocation } = useSelectedLocation();
  const resultsListRef = useScrollIndicator<HTMLUListElement>();

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<kakao.maps.services.PlacesSearchResultItem[]>([]);
  const debouncedKeyword = useDebouncedValue(keyword, SEARCH_DEBOUNCE_MS);

  // services 라이브러리 로딩. 키 없음/로딩/에러 시 자동완성 비활성.
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY ?? "",
    libraries: ["services"],
  });
  const isServicesReady = !loading && !error && Boolean(process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY);

  useEffect(() => {
    const query = debouncedKeyword.trim();
    if (!isServicesReady || query.length === 0 || !window.kakao?.maps?.services) {
      return;
    }

    // 콜백 도착 전 쿼리가 바뀌면 이전 응답을 무시
    let isStale = false;
    const places = new kakao.maps.services.Places();
    places.keywordSearch(
      query,
      (data, status) => {
        if (isStale) return;
        setResults(status === kakao.maps.services.Status.OK ? data : []);
      },
      // 제주 영역을 우선 검색(전국 인기 장소가 상위에 오는 것 방지)
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
  }, [debouncedKeyword, isServicesReady]);

  const hasKeyword = keyword.length > 0;
  const showResults = useMemo(
    () => hasKeyword && results.length > 0,
    [hasKeyword, results.length],
  );

  const handleClear = () => {
    setKeyword("");
    setResults([]);
  };

  const handleSelect = (place: kakao.maps.services.PlacesSearchResultItem) => {
    setLocation({
      name: place.place_name,
      address: place.road_address_name || place.address_name,
      point: { lat: Number(place.y), lng: Number(place.x) },
    });
    router.push("/");
  };

  return (
    <div className={`flex min-h-dvh flex-col bg-bg-default ${PUBLIC_APP_MAX_WIDTH_CLASS}`}>
      {/* 헤더 */}
      <header className="flex items-center gap-(--gap-3) px-(--padding-5) py-(--padding-4)">
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={() => router.back()}
          className="text-text-primary"
        >
          <ChevronLeftIcon width={24} height={24} />
        </button>
        <h1 className="text-heading-small-mobile text-text-primary">위치 설정</h1>
      </header>

      {/* 검색 필드 */}
      <div className="px-(--padding-5) pt-(--padding-3)">
        <SearchField
          value={keyword}
          onValueChange={setKeyword}
          placeholder="장소를 검색하세요"
          trailing={
            hasKeyword ? (
              <button
                type="button"
                aria-label="검색어 지우기"
                onClick={handleClear}
                className="rounded-sm bg-bg-surface p-(--padding-1) text-text-tertiary"
              >
                <XIcon width={20} height={20} />
              </button>
            ) : undefined
          }
        />
      </div>

      {/* 현재 위치로 주소 찾기 */}
      <div className="px-(--padding-5) pt-(--padding-3)">
        <Button
          platform="mobile"
          variant="tertiary"
          className="w-full justify-between"
          onClick={() => router.push("/location/current")}
        >
          <span>현재 위치로 주소 찾기</span>
          <TargetIcon width={20} height={20} />
        </Button>
      </div>

      {/* 자동완성 리스트 */}
      {showResults ? (
        <ul
          className="scrollbar-indicator mt-(--gap-3) min-h-0 flex-1 overflow-y-auto"
          ref={resultsListRef}
        >
          {results.map((place, index) => (
            <li key={`${place.id}-${index}`}>
              <button
                type="button"
                onClick={() => handleSelect(place)}
                className={[
                  "flex w-full px-(--padding-5) py-(--padding-4) text-left text-body-xxsmall-mobile",
                  index < results.length - 1 ? "border-b border-border-default" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <HighlightedName name={place.place_name} query={keyword} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
