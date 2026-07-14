import type { TipOffDetail, TipOffListItem } from "../types";

export function getTipOffDetail(item: TipOffListItem): TipOffDetail {
  return {
    ...item,
    description: "제보 상세 설명은 목록 API에서 제공되지 않습니다.",
    images: item.thumbnailSrc ? [item.thumbnailSrc] : [],
    location: { lat: 33.4996, lng: 126.5312 },
    locationLabel:
      [item.beach, item.address].filter(Boolean).join(" · ") || "위치 정보 없음",
  };
}
