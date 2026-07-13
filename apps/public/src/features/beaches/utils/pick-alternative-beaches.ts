import { RISK_ORDER } from "@/shared/risk/types";
import type { BeachListItem } from "../types";
import { squaredDistance } from "./sort-beaches";

// 대체 해변 추천 개수(Figma 기준 상위 4개)
const MAX_ALTERNATIVES = 4;

// 대체 해변 계산: 현재 해변 제외 -> 위험도 낮은 순 -> 현재 해변 기준 가까운 순.
// API에 대체 해변 개념이 없어 목록 데이터로 클라이언트에서 파생한다.
export function pickAlternativeBeaches(
  beaches: readonly BeachListItem[],
  current: BeachListItem,
): BeachListItem[] {
  return beaches
    .filter((beach) => beach.id !== current.id)
    .slice()
    .sort((a, b) => {
      // 1순위: 위험도 낮은 등급
      const riskDiff = RISK_ORDER.indexOf(a.risk) - RISK_ORDER.indexOf(b.risk);
      if (riskDiff !== 0) {
        return riskDiff;
      }
      // 2순위: 현재 해변과 가까운 거리
      return squaredDistance(a.point, current.point) - squaredDistance(b.point, current.point);
    })
    .slice(0, MAX_ALTERNATIVES);
}
