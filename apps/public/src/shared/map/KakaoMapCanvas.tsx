"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { Map, useKakaoLoader } from "react-kakao-maps-sdk";
import type { MapPoint } from "@/shared/risk/types";

// 지도 bounds fit 시 여백(px). admin과 동일 값
const BOUNDS_PADDING_PX = 60;

const CONTAINER_CLASS =
  "relative h-full w-full overflow-hidden rounded-2xl bg-[var(--color-primary-5)]";

export type KakaoMapCanvasProps = {
  center: MapPoint;
  level?: number;
  fitPoints?: MapPoint[];
  children?: ReactNode;
  className?: string;
  onMapCreate?: (map: kakao.maps.Map) => void;
  onCenterChanged?: (point: MapPoint) => void;
};

function containerClassName(className?: string): string {
  return [CONTAINER_CLASS, className].filter(Boolean).join(" ");
}

function MapMessage({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center px-(--padding-4) text-center text-body-xxsmall-mobile text-text-tertiary">
      {message}
    </div>
  );
}

function LoadedMap({
  appkey,
  center,
  level,
  fitPoints,
  children,
  onMapCreate,
  onCenterChanged,
}: { appkey: string } & Omit<KakaoMapCanvasProps, "className">) {
  const [loading, error] = useKakaoLoader({ appkey, libraries: ["services"] });
  const didFitRef = useRef(false);

  if (error) return <MapMessage message="지도를 불러오지 못했습니다." />;
  if (loading) return <MapMessage message="지도를 불러오는 중입니다." />;

  // 드래그/줌 종료 시 현재 중심을 상위로 전달
  const emitCenter = (map: kakao.maps.Map) => {
    if (!onCenterChanged) return;
    const c = map.getCenter();
    onCenterChanged({ lat: c.getLat(), lng: c.getLng() });
  };

  return (
    <Map
      center={center}
      className="h-full w-full"
      level={level}
      onCreate={(map) => {
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
      onDragEnd={emitCenter}
      onZoomChanged={emitCenter}
    >
      {children}
    </Map>
  );
}

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
