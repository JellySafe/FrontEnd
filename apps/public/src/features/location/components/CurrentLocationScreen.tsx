"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, MapPin } from "@jellysafe/design-system";
import { KakaoMapCanvas } from "@/shared/map/KakaoMapCanvas";
import { useSelectedLocation } from "@/shared/location/SelectedLocationProvider";
import { PUBLIC_APP_MAX_WIDTH_CLASS } from "@/shared/ui/public-layout";
import type { MapPoint } from "@/shared/risk/types";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { ChevronLeftIcon } from "./icons";

const GEOCODE_DEBOUNCE_MS = 300;
// 초기 중심(제주)
const JEJU_CENTER: MapPoint = { lat: 33.375, lng: 126.53 };

// 어떤 좌표에 대한 주소인지 함께 저장해 로딩 여부를 파생 계산한다.
type ResolvedAddress = { name: string; detail: string; point: MapPoint };

export type CurrentLocationResult = {
  name: string;
  address: string;
  point: MapPoint;
};

export type CurrentLocationScreenProps = {
  /** 있으면 홈 SelectedLocation 저장 대신 이 콜백만 호출 */
  onConfirmLocation?: (location: CurrentLocationResult) => void;
  /** 있으면 router.back() 대신 호출 */
  onBack?: () => void;
};

export function CurrentLocationScreen({
  onConfirmLocation,
  onBack,
}: CurrentLocationScreenProps = {}) {
  const router = useRouter();
  const { setLocation } = useSelectedLocation();

  // 지도는 비제어(center prop 고정). 추적 좌표는 별도 state로만 관리해 되먹임 루프를 끊는다.
  const [trackedCenter, setTrackedCenter] = useState<MapPoint>(JEJU_CENTER);
  const [address, setAddress] = useState<ResolvedAddress | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  // GPS 확정 전에는 역지오코딩하지 않아 제주 기본 주소가 깜빡이지 않게 한다.
  const [geoStatus, setGeoStatus] = useState<"locating" | "ready">("locating");
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const geocoderRef = useRef<kakao.maps.services.Geocoder | null>(null);

  // debounce된 추적 좌표로만 역지오코딩 호출
  const debouncedCenter = useDebouncedValue(trackedCenter, GEOCODE_DEBOUNCE_MS);

  // 초기 진입 시 현재 위치로 지도 이동(실패/거부/미지원 시 제주 유지)
  useEffect(() => {
    if (!isMapReady) return;
    if (!navigator.geolocation) {
      setGeoStatus("ready");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = { lat: position.coords.latitude, lng: position.coords.longitude };
        // 프로그램적 이동은 center prop이 아니라 map 인스턴스로 수행(루프 없음)
        mapRef.current?.setCenter(new kakao.maps.LatLng(point.lat, point.lng));
        setTrackedCenter(point);
        setGeoStatus("ready");
      },
      () => {
        // 거부/실패 시 제주 기본값 유지
        setGeoStatus("ready");
      },
    );
  }, [isMapReady]);

  // 중심 좌표 → 주소 역지오코딩 (GPS 확정 후 + debounce가 tracked에 맞춰진 뒤에만)
  useEffect(() => {
    if (!isMapReady || geoStatus !== "ready") return;
    // 초기 GPS 직후 debounce가 아직 제주면 조회하지 않음(깜빡임 방지)
    if (
      debouncedCenter.lat !== trackedCenter.lat ||
      debouncedCenter.lng !== trackedCenter.lng
    ) {
      return;
    }
    if (!window.kakao?.maps?.services) return;
    if (!geocoderRef.current) {
      geocoderRef.current = new kakao.maps.services.Geocoder();
    }

    let isStale = false;
    geocoderRef.current.coord2Address(
      debouncedCenter.lng,
      debouncedCenter.lat,
      (result, status) => {
        if (isStale || status !== kakao.maps.services.Status.OK || result.length === 0) return;
        const road = result[0].road_address;
        const jibun = result[0].address;
        const detail = road?.address_name ?? jibun?.address_name ?? "";
        const name = road?.building_name ? road.building_name : detail;
        setAddress({ name, detail, point: debouncedCenter });
      },
    );

    return () => {
      isStale = true;
    };
  }, [debouncedCenter, trackedCenter, isMapReady, geoStatus]);

  // 현재 중심에 대한 주소가 준비됐는지(로딩/실패 시 설정 비활성)
  const isAddressReady =
    address !== null &&
    address.point.lat === debouncedCenter.lat &&
    address.point.lng === debouncedCenter.lng;

  const handleMapCreate = (map: kakao.maps.Map) => {
    mapRef.current = map;
    setIsMapReady(true);
  };

  const handleConfirm = () => {
    if (!isAddressReady || !address) return;
    const result: CurrentLocationResult = {
      name: address.name,
      address: address.detail,
      point: trackedCenter,
    };
    if (onConfirmLocation) {
      onConfirmLocation(result);
      return;
    }
    setLocation({
      name: result.name,
      address: result.address,
      point: result.point,
    });
    router.push("/");
  };

  return (
    <div className={`flex h-dvh flex-col bg-bg-default ${PUBLIC_APP_MAX_WIDTH_CLASS}`}>
      {/* 헤더 */}
      <header className="flex items-center gap-(--gap-3) px-(--padding-5) py-(--padding-4)">
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={() => (onBack ? onBack() : router.back())}
          className="text-text-primary"
        >
          <ChevronLeftIcon width={24} height={24} />
        </button>
        <h1 className="text-heading-small-mobile text-text-primary">현재 위치 찾기</h1>
      </header>

      {/* 지도 영역 */}
      <div className="relative min-h-0 flex-1">
        <KakaoMapCanvas
          center={JEJU_CENTER}
          level={3}
          className="rounded-none"
          onMapCreate={handleMapCreate}
          onCenterChanged={setTrackedCenter}
        />

        {/* 중앙 고정 마커: 핀 끝이 지도 중심을 가리키도록 배치 */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full">
          <MapPin status="primary" />
        </div>

        {/* 하단 주소 카드 */}
        {/* 카카오 지도 내부 레이어가 z-index를 가지므로 카드/핀은 z-10으로 항상 위에 표시 */}
        <div className="absolute bottom-(--padding-8) left-(--padding-5) right-(--padding-5) z-10 rounded-2xl bg-bg-default shadow-[0_0_24px_0_var(--color-alpha-black-10)]">
          <div className="flex flex-col items-stretch gap-(--gap-4) p-(--padding-5)">
            <div className="mx-auto h-1 w-12 rounded-full bg-border-default" />
            <div
              className={`flex flex-col gap-(--gap-2)${address && !isAddressReady ? " opacity-60" : ""}`}
            >
              {address === null ? (
                <p className="text-heading-xsmall-mobile text-text-primary">
                  주소를 불러오는 중
                </p>
              ) : (
                <>
                  <p className="text-heading-xsmall-mobile text-text-primary">{address.name}</p>
                  <p className="text-caption-small-mobile text-text-tertiary">{address.detail}</p>
                </>
              )}
            </div>
            <Button
              platform="mobile"
              variant="primary"
              className="w-full"
              disabled={!isAddressReady}
              onClick={handleConfirm}
            >
              설정하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
