"use client";

import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { KakaoMapCanvas } from "@/shared/map/KakaoMapCanvas";
import { PIN_FOCUS_LEVEL } from "@/shared/map/constants";
import { RISK_DOT_CLASS, RISK_LABEL } from "@/shared/risk/types";
import type { RiskLevel } from "@/shared/risk/types";
import type { TipOffDetail } from "../types";

const LEGEND_ORDER: RiskLevel[] = ["critical", "danger", "caution", "safe"];

const PIN_COLOR: Record<RiskLevel, string> = {
  critical: "text-[var(--color-critical-50)]",
  danger: "text-[var(--color-danger-50)]",
  caution: "text-[var(--color-caution-30)]",
  safe: "text-[var(--color-safe-50)]",
};

export type TipOffLocationProps = {
  detail: TipOffDetail;
};

// tip-off 전용 16×16 map_pin (DS MapPin과 다름). fill은 currentColor.
function TipOffMapPin({ risk }: { risk: RiskLevel }) {
  return (
    <svg
      aria-hidden
      className={["size-4 shrink-0", PIN_COLOR[risk]].join(" ")}
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        clipRule="evenodd"
        d="M3.47463 1.9411C5.97404 -0.647059 10.0261 -0.647007 12.5256 1.9411C15.0249 4.52929 15.025 8.72526 12.5256 11.3135L7.99977 16L3.47463 11.3135C0.975278 8.72521 0.975227 4.52926 3.47463 1.9411ZM11.52 2.98239C9.57606 0.96944 6.42419 0.969387 4.48022 2.98239C2.53624 4.9954 2.53629 8.25918 4.48022 10.2722L6.5775 12.4439V10.3088H9.42203V12.4439L11.52 10.2722C13.464 8.25924 13.4639 4.99544 11.52 2.98239Z"
        fill="currentColor"
        fillRule="evenodd"
      />
      <path
        d="M7.99998 0.736064C11.142 0.736064 13.689 3.53843 13.689 6.99533C13.689 10.4522 11.142 13.2546 7.99998 13.2546C4.858 13.2546 2.31092 10.4522 2.31092 6.99533C2.31092 3.53843 4.858 0.736064 7.99998 0.736064Z"
        fill="currentColor"
      />
    </svg>
  );
}

// 제보 위치 지도. 제보 좌표를 중심으로 tip-off 핀과 해변명을 표시한다.
export function TipOffLocation({ detail }: TipOffLocationProps) {
  return (
    <section className="flex flex-col gap-(--gap-3)">
      <h3 className="text-heading-xsmall-pc text-text-primary">위치</h3>
      <div className="relative h-[385px] w-full">
        <KakaoMapCanvas center={detail.location} level={PIN_FOCUS_LEVEL}>
          {/* CSS translate로 맞추면 줌 시 픽셀 오프셋이 위경도로 커져 핀이 밀림. 앵커로 tip을 좌표에 고정 */}
          <CustomOverlayMap position={detail.location} xAnchor={0.5} yAnchor={1}>
            <div className="relative h-4 w-4">
              <TipOffMapPin risk={detail.risk} />
              <p className="absolute top-full left-1/2 -translate-x-1/2 text-caption-medium-pc whitespace-nowrap text-text-primary">
                {detail.beach}
              </p>
            </div>
          </CustomOverlayMap>
        </KakaoMapCanvas>
        <div className="pointer-events-none absolute right-[30px] bottom-[30px] z-10 flex items-center gap-(--gap-3) px-(--padding-3) py-(--padding-2)">
          {LEGEND_ORDER.map((risk) => (
            <span className="flex items-center gap-(--gap-2)" key={risk}>
              <span className={["size-[6px] rounded-full", RISK_DOT_CLASS[risk]].join(" ")} />
              <span className="text-caption-small-pc text-text-secondary">{RISK_LABEL[risk]}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
