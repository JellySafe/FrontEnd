"use client";

import { MapPin } from "@jellysafe/design-system";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import type { BeachSummary } from "../types";

export type DashboardMapMarkerProps = {
  beach: BeachSummary;
  selected: boolean;
  showLabel: boolean;
  onSelect: (id: string) => void;
};

// 지도 좌표에 고정되는 마커. 선택 시 focused-raised로 강조하고, 선택/겹침 규칙에 따라 이름 라벨을 노출한다.
export function DashboardMapMarker({
  beach,
  selected,
  showLabel,
  onSelect,
}: DashboardMapMarkerProps) {
  return (
    <CustomOverlayMap clickable position={beach.point} zIndex={selected ? 20 : 10}>
      <button
        aria-label={`${beach.name} 마커`}
        aria-pressed={selected}
        className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
        onClick={() => onSelect(beach.id)}
        type="button"
      >
        <MapPin
          label={showLabel ? beach.name : undefined}
          state={selected ? "focused-raised" : "default"}
          status={beach.risk}
        />
      </button>
    </CustomOverlayMap>
  );
}
