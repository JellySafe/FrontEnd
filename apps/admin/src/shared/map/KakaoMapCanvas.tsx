"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { Map, useKakaoLoader } from "react-kakao-maps-sdk";
import type { MapPoint } from "@/features/dashboard/types";
import { BOUNDS_PADDING_PX } from "./constants";

// 모든 상태에서 동일한 컨테이너 레이아웃/클리핑을 유지한다.
const CONTAINER_CLASS =
  "relative h-full w-full overflow-hidden rounded-2xl bg-[var(--color-primary-5)]";

export type KakaoMapCanvasProps = {
  center: MapPoint;
  level?: number;
  fitPoints?: MapPoint[];
  children?: ReactNode;
  className?: string;
  onMapCreate?: (map: kakao.maps.Map) => void;
};

function containerClassName(className?: string): string {
  return [CONTAINER_CLASS, className].filter(Boolean).join(" ");
}

// 상태 메시지 fallback(키 없음/로딩/에러)
function MapMessage({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center px-(--padding-4) text-center text-body-xxsmall-pc text-text-tertiary">
      {message}
    </div>
  );
}

// SDK 로딩 이후 실제 지도를 렌더한다. useKakaoLoader는 최초 1회만 스크립트를 주입한다.
function LoadedMap({
  appkey,
  center,
  level,
  fitPoints,
  children,
  onMapCreate,
}: {
  appkey: string;
} & Omit<KakaoMapCanvasProps, "className">) {
  const [loading, error] = useKakaoLoader({ appkey });
  // fitPoints setBounds를 최초 1회만 실행하기 위한 가드
  const didFitRef = useRef(false);

  if (error) {
    return <MapMessage message="지도를 불러오지 못했습니다." />;
  }
  if (loading) {
    return <MapMessage message="지도를 불러오는 중입니다." />;
  }

  return (
    <Map
      center={center}
      className="h-full w-full"
      level={level}
      onCreate={(map) => {
        // fitPoints가 있으면 전체 좌표를 감싸도록 1회만 bounds를 맞춘다.
        if (fitPoints && fitPoints.length > 0 && !didFitRef.current) {
          didFitRef.current = true;
          const bounds = new kakao.maps.LatLngBounds();
          for (const point of fitPoints) {
            bounds.extend(new kakao.maps.LatLng(point.lat, point.lng));
          }
          map.setBounds(bounds, BOUNDS_PADDING_PX);
        }
        onMapCreate?.(map);
      }}
    >
      {children}
    </Map>
  );
}

// 카카오 지도 렌더러. env 키가 없으면 crash 대신 fallback UI를 렌더한다.
export function KakaoMapCanvas({ className, ...rest }: KakaoMapCanvasProps) {
  const appkey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  return (
    <div className={containerClassName(className)}>
      {appkey ? (
        <LoadedMap appkey={appkey} {...rest} />
      ) : (
        <MapMessage message="지도 API 키가 설정되지 않았습니다." />
      )}
    </div>
  );
}
