"use client";

import { Badge } from "@jellysafe/design-system";
import { useRouter } from "next/navigation";
import { useLikes } from "@/shared/likes/LikesProvider";
import { RISK_LABEL } from "@/shared/risk/types";
import type { RiskLevel } from "@/shared/risk/types";

// chevron-left(뒤로) 아이콘 path
const CHEVRON_LEFT =
  "M11.0502 12.0007L16 7.05093L14.5858 5.63672L8.22182 12.0007L14.5858 18.3646L16 16.9504L11.0502 12.0007Z";
// 하트 아웃라인(관심 미등록)
const HEART_OUTLINE =
  "M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z";
// 하트 채움(관심 등록)
const HEART_FILLED =
  "M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z";

export type BeachDetailHeaderProps = {
  beachId: string;
  name: string;
  risk: RiskLevel;
};

export function BeachDetailHeader({ beachId, name, risk }: BeachDetailHeaderProps) {
  const router = useRouter();
  const { isLiked, toggleLike } = useLikes();
  const liked = isLiked(beachId);

  return (
    // Figma header/mobile: sticky로 스크롤 중에도 상단 유지
    <header className="sticky top-0 z-20 flex items-center gap-[var(--gap-3)] bg-bg-default px-[var(--padding-5)] py-[var(--padding-4)]">
      <button aria-label="뒤로 가기" onClick={() => router.back()} type="button">
        <svg className="size-6 text-icon-secondary" fill="none" viewBox="0 0 24 24">
          <path d={CHEVRON_LEFT} fill="currentColor" />
        </svg>
      </button>
      <h1 className="text-heading-small-mobile text-text-primary">{name}</h1>
      <Badge status={risk}>{RISK_LABEL[risk]}</Badge>
      <button
        aria-label={liked ? `${name} 관심 해제` : `${name} 관심 등록`}
        aria-pressed={liked}
        className="ml-auto"
        onClick={() => toggleLike(beachId)}
        type="button"
      >
        <svg
          className={["size-6", liked ? "text-icon-brand" : "text-icon-tertiary"].join(" ")}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d={liked ? HEART_FILLED : HEART_OUTLINE} fill="currentColor" />
        </svg>
      </button>
    </header>
  );
}
