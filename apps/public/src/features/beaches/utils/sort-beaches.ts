import type { MapPoint, RiskLevel } from "@/shared/risk/types";
import { RISK_ORDER } from "@/shared/risk/types";
import type { BeachListItem } from "../types";

// 홈 정렬 옵션 값(정렬 Dropdown value와 일치)
export type BeachSortValue = "riskAsc" | "riskDesc" | "nearest" | "liked";

// 위경도 유클리드 근사 거리 제곱(지구 곡률 무시). 근거리 상대 비교용이라 하버사인 불필요.
export function squaredDistance(a: MapPoint, b: MapPoint): number {
  const dx = a.lat - b.lat;
  const dy = a.lng - b.lng;
  return dx * dx + dy * dy;
}

// 위험 등급 순위(safe=0 ... critical=3). 목록 API엔 riskScore가 없어 등급 인덱스로 정렬.
function riskRank(risk: RiskLevel): number {
  return RISK_ORDER.indexOf(risk);
}

type FilterOptions = {
  keyword: string;
  risks: Set<RiskLevel>;
};

// 검색어(이름 부분일치, 대소문자 무시)와 위험도 다중 선택으로 목록 필터
export function filterBeaches<T extends BeachListItem>(
  beaches: readonly T[],
  { keyword, risks }: FilterOptions,
): T[] {
  const normalized = keyword.trim().toLowerCase();
  return beaches.filter((beach) => {
    const matchesKeyword =
      normalized.length === 0 || beach.name.toLowerCase().includes(normalized);
    // 선택된 위험도가 없으면 전체 통과, 있으면 해당 위험도만
    const matchesRisk = risks.size === 0 || risks.has(beach.risk);
    return matchesKeyword && matchesRisk;
  });
}

type SortOptions = {
  sort: BeachSortValue;
  origin: MapPoint | null;
  isLiked: (id: string) => boolean;
};

// 선택된 정렬 기준으로 새 배열 반환(원본 불변). 안정 정렬을 위해 index 보조 비교.
export function sortBeaches<T extends BeachListItem>(
  beaches: readonly T[],
  { sort, origin, isLiked }: SortOptions,
): T[] {
  const withIndex = beaches.map((beach, index) => ({ beach, index }));

  withIndex.sort((a, b) => {
    let diff = 0;
    if (sort === "riskAsc") {
      // 위험도 낮은 순: 등급 인덱스 오름차순
      diff = riskRank(a.beach.risk) - riskRank(b.beach.risk);
    } else if (sort === "riskDesc") {
      diff = riskRank(b.beach.risk) - riskRank(a.beach.risk);
    } else if (sort === "nearest") {
      // 선택 위치가 없으면 정렬 생략(원래 순서 유지)
      if (origin) {
        diff = squaredDistance(a.beach.point, origin) - squaredDistance(b.beach.point, origin);
      }
    } else if (sort === "liked") {
      // 좋아요된 해변을 앞으로(내림차순: true=1 우선)
      diff = Number(isLiked(b.beach.id)) - Number(isLiked(a.beach.id));
    }
    // 동점이면 원래 순서 유지(안정 정렬)
    return diff !== 0 ? diff : a.index - b.index;
  });

  return withIndex.map((entry) => entry.beach);
}
