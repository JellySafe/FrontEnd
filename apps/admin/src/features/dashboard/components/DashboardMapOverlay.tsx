import { RISK_DOT_CLASS, RISK_LABEL } from "../types";
import type { RiskLevel } from "../types";

const LEGEND_ORDER: RiskLevel[] = ["critical", "danger", "caution", "safe"];

// 지도 위 범례(정보 오버레이). 마커 색상과 위험 단계 매핑을 안내.
export function DashboardMapOverlay() {
  return (
    <div className="pointer-events-none absolute right-[30px] bottom-[30px] z-10 flex items-center gap-(--gap-3) px-(--padding-3) py-(--padding-2)">
      {LEGEND_ORDER.map((risk) => (
        <span className="flex items-center gap-(--gap-2)" key={risk}>
          <span className={["size-[6px] rounded-full", RISK_DOT_CLASS[risk]].join(" ")} />
          <span className="text-caption-small-pc text-text-secondary">{RISK_LABEL[risk]}</span>
        </span>
      ))}
    </div>
  );
}
