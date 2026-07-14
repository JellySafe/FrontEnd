import type { BackendRiskLevel } from "@/shared/api/types";
import type { RiskLevel } from "@/shared/risk/types";

// 백엔드 severe -> 프론트 critical. 그 외 등급은 명칭 동일.
export function toRiskLevel(level: BackendRiskLevel): RiskLevel {
  return level === "severe" ? "critical" : level;
}

// currentRiskLevel이 string|null인 경우를 안전하게 RiskLevel로 변환한다.
export function toRiskLevelSafe(level: string | null): RiskLevel {
  if (
    level === "safe" ||
    level === "caution" ||
    level === "danger" ||
    level === "severe"
  ) {
    // 리터럴 비교로 BackendRiskLevel로 좁혀지므로 단언 없이 매퍼에 전달 가능
    return toRiskLevel(level);
  }
  return "safe";
}
