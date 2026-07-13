import { Badge } from "@jellysafe/design-system";
import Link from "next/link";
import { RISK_LABEL } from "@/shared/risk/types";
import type { BeachListItem } from "../types";

// chevron-right(trailing) 아이콘 path
const CHEVRON_RIGHT =
  "M13.1715 12.0007L8.22168 7.05093L9.6359 5.63672L15.9999 12.0007L9.6359 18.3646L8.22168 16.9504L13.1715 12.0007Z";

export type AlternativeBeachesProps = { beaches: BeachListItem[] };

export function AlternativeBeaches({ beaches }: AlternativeBeachesProps) {
  // 대체 해변이 없으면 섹션 자체를 렌더하지 않음
  if (beaches.length === 0) {
    return null;
  }

  return (
    // Figma: 제목↔리스트 8px
    <section className="flex flex-col gap-[var(--gap-3)]">
      <h2 className="text-heading-xsmall-mobile text-text-primary">대체 해변 추천</h2>
      <ul className="divide-y divide-border-default">
        {beaches.map((alt) => (
          <li key={alt.id}>
            <Link
              className="flex items-center gap-[var(--gap-4)] py-[var(--padding-4)]"
              href={`/beaches/${alt.id}`}
            >
              <Badge platform="mobile" status={alt.risk}>
                {RISK_LABEL[alt.risk]}
              </Badge>
              <span className="flex min-w-0 flex-1 flex-col gap-[var(--gap-1)]">
                <span className="text-body-xsmall-mobile text-text-primary">{alt.name}</span>
                <span className="text-caption-small-mobile text-text-tertiary">{alt.address}</span>
              </span>
              <svg
                aria-hidden="true"
                className="size-5 shrink-0 text-icon-tertiary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path d={CHEVRON_RIGHT} fill="currentColor" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
