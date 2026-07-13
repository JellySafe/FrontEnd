import { RISK_GUIDE_MESSAGE } from "@/shared/risk/types";
import type { RiskLevel } from "@/shared/risk/types";

// 상태별 배너 배경/테두리/텍스트 색. caution만 텍스트가 caution-50.
const BANNER_CLASSES: Record<RiskLevel, string> = {
  safe: "bg-[color-mix(in_srgb,var(--color-safe-50)_25%,transparent)] border border-[color-mix(in_srgb,var(--color-safe-50)_50%,transparent)] text-[var(--color-safe-50)]",
  caution:
    "bg-[color-mix(in_srgb,var(--color-caution-30)_25%,transparent)] border border-[color-mix(in_srgb,var(--color-caution-30)_50%,transparent)] text-[var(--color-caution-50)]",
  danger:
    "bg-[color-mix(in_srgb,var(--color-danger-50)_25%,transparent)] border border-[color-mix(in_srgb,var(--color-danger-50)_50%,transparent)] text-[var(--color-danger-50)]",
  critical:
    "bg-[color-mix(in_srgb,var(--color-critical-50)_25%,transparent)] border border-[color-mix(in_srgb,var(--color-critical-50)_50%,transparent)] text-[var(--color-critical-50)]",
};

// risk는 배너 색상용, guideText가 있으면 API 안내문을 우선 사용하고 없으면 등급별 기본 문구.
export type RiskGuideBannerProps = { risk: RiskLevel; guideText?: string };

export function RiskGuideBanner({ risk, guideText }: RiskGuideBannerProps) {
  const message = guideText?.trim() ? guideText : RISK_GUIDE_MESSAGE[risk];
  return (
    <p className={["rounded-2xl px-(--padding-5) py-(--padding-4) text-body-xsmall-mobile", BANNER_CLASSES[risk]].join(" ")}>
      {message}
    </p>
  );
}
