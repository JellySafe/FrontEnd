"use client";

import { useCallback, useEffect, useState } from "react";
import type { BeachSummary } from "../types";

// 라벨 예상 rect 크기(핀 아래로 그려지는 이름 라벨 기준)
const LABEL_MAX_WIDTH = 80;
const LABEL_HEIGHT = 15;
// 핀 픽셀 좌표(핀 앵커) 기준 라벨 top 오프셋 — MapPin의 top-[22px]와 정렬
const LABEL_TOP_OFFSET = 22;

type LabelRect = {
  id: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
  score: number;
};

// 두 rect가 겹치는지 검사
function isOverlapping(a: LabelRect, b: LabelRect): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

// 겹침 그래프의 연결 요소(클러스터)를 구성한다.
function buildClusters(rects: LabelRect[]): LabelRect[][] {
  const n = rects.length;
  const visited = new Array<boolean>(n).fill(false);
  const clusters: LabelRect[][] = [];

  for (let i = 0; i < n; i += 1) {
    if (visited[i]) continue;
    const cluster: LabelRect[] = [];
    const stack = [i];
    visited[i] = true;
    while (stack.length > 0) {
      const current = stack.pop();
      if (current === undefined) break;
      cluster.push(rects[current]);
      for (let j = 0; j < n; j += 1) {
        if (!visited[j] && isOverlapping(rects[current], rects[j])) {
          visited[j] = true;
          stack.push(j);
        }
      }
    }
    clusters.push(cluster);
  }
  return clusters;
}

// 클러스터 규칙: riskScore 최고 핀 1개만 라벨 표시, 최고점 동률이면 전체 숨김.
function resolveVisibleIds(clusters: LabelRect[][]): Set<string> {
  const visible = new Set<string>();
  for (const cluster of clusters) {
    if (cluster.length === 1) {
      visible.add(cluster[0].id);
      continue;
    }
    const maxScore = Math.max(...cluster.map((rect) => rect.score));
    const topRects = cluster.filter((rect) => rect.score === maxScore);
    // 최고점이 유일할 때만 그 핀 라벨을 표시(동률이면 클러스터 전체 숨김)
    if (topRects.length === 1) {
      visible.add(topRects[0].id);
    }
  }
  return visible;
}

// 대시보드 핀 라벨 겹침 처리 훅. 픽셀 투영으로 라벨 rect 교차를 계산해 표시 대상 id를 반환한다.
// 선택된 핀(selectedId)은 계산에서 제외하며 라벨은 항상 표시한다.
export function useMarkerLabelVisibility(
  map: kakao.maps.Map | null,
  beaches: BeachSummary[],
  selectedId: string | null,
): Set<string> {
  const [visibleIds, setVisibleIds] = useState<Set<string>>(() => new Set());

  const recompute = useCallback(() => {
    if (!map) {
      setVisibleIds(new Set());
      return;
    }
    const projection = map.getProjection();
    // 선택된 핀은 충돌 계산에서 제외한다.
    const targets = beaches.filter((beach) => beach.id !== selectedId);

    const rects: LabelRect[] = targets.map((beach) => {
      const point = projection.containerPointFromCoords(
        new kakao.maps.LatLng(beach.point.lat, beach.point.lng),
      );
      const top = point.y + LABEL_TOP_OFFSET;
      return {
        id: beach.id,
        left: point.x - LABEL_MAX_WIDTH / 2,
        right: point.x + LABEL_MAX_WIDTH / 2,
        top,
        bottom: top + LABEL_HEIGHT,
        score: beach.riskScore,
      };
    });

    setVisibleIds(resolveVisibleIds(buildClusters(rects)));
  }, [map, beaches, selectedId]);

  useEffect(() => {
    if (!map) return;
    // 초기 bounds fit이 반영된 다음 프레임에 최초 계산(effect 내 동기 setState 회피)
    const rafId = window.requestAnimationFrame(recompute);
    // 줌 변경 시 상대 간격이 바뀌므로 재계산(팬은 간격 불변이라 불필요)
    kakao.maps.event.addListener(map, "zoom_changed", recompute);
    return () => {
      window.cancelAnimationFrame(rafId);
      kakao.maps.event.removeListener(map, "zoom_changed", recompute);
    };
  }, [map, recompute]);

  return visibleIds;
}
