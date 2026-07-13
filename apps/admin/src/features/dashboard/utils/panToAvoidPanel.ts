import type { MapPoint } from "../types";

// DashboardDetailPanel의 실제 배치와 정렬(absolute left-16px, w-400px)
const PANEL_LEFT = 16;
const PANEL_WIDTH = 400;
// 패널 우측과 핀 사이 최소 여백
const PANEL_GAP = 24;
// 뷰포트 가장자리 여백(핀이 이 안쪽에 있어야 "보임"으로 판단)
const VIEWPORT_MARGIN = 24;

// 선택 핀이 패널에 가려지거나 뷰포트 밖이면, 패널을 제외한 영역의 센터로 지도를 이동한다.
// 가려지지 않고 보이면 지도를 움직이지 않는다.
export function panToAvoidPanel(map: kakao.maps.Map, point: MapPoint): void {
  const container = map.getNode();
  const width = container.clientWidth;
  const height = container.clientHeight;
  if (width === 0 || height === 0) return;

  const projection = map.getProjection();
  const latlng = new kakao.maps.LatLng(point.lat, point.lng);
  const pixel = projection.containerPointFromCoords(latlng);

  // 패널에 가리지 않는 가시 영역(패널 오른쪽 ~ 뷰포트 오른쪽)
  const safeLeft = PANEL_LEFT + PANEL_WIDTH + PANEL_GAP;
  const isVisible =
    pixel.x >= safeLeft &&
    pixel.x <= width - VIEWPORT_MARGIN &&
    pixel.y >= VIEWPORT_MARGIN &&
    pixel.y <= height - VIEWPORT_MARGIN;

  if (isVisible) return;

  // 가시 영역의 센터에 핀이 오도록 목표 지점을 역산한다.
  const targetPixelX = (safeLeft + width) / 2;
  const targetPixelY = height / 2;
  // 현재 핀 픽셀과 목표 픽셀의 차이만큼 지도 중심을 이동시킨다.
  const centerPixel = projection.containerPointFromCoords(map.getCenter());
  const nextCenterPixel = new kakao.maps.Point(
    centerPixel.x + (pixel.x - targetPixelX),
    centerPixel.y + (pixel.y - targetPixelY),
  );
  const nextCenter = projection.coordsFromContainerPoint(nextCenterPixel);
  map.panTo(nextCenter);
}
