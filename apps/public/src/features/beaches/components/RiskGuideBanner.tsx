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

export type RiskGuideBannerProps = { risk: RiskLevel };

export function RiskGuideBanner({ risk }: RiskGuideBannerProps) {
  return (
    <p className={["rounded-2xl px-(--padding-5) py-(--padding-4) text-body-xsmall-mobile", BANNER_CLASSES[risk]].join(" ")}>
      {RISK_GUIDE_MESSAGE[risk]}
    </p>
  );
}
