"use client";

import { useFirstAidGuideQuery } from "../api/useFirstAidGuideQuery";

// body의 빈 줄(\n\n) 기준으로 카드 블록을 나눈다. API는 plain text만 제공.
function splitGuideBlocks(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
}

// 응급 대처법 — GET /api/public/guides 의 FIRST_AID
export function EmergencyGuide() {
  const { data: guide, isLoading, isError } = useFirstAidGuideQuery();

  if (isLoading) {
    return (
      <section className="flex flex-col gap-[var(--gap-3)]">
        <h2 className="text-heading-xsmall-mobile text-text-primary">해파리 접촉피해 응급 대처법</h2>
        <p className="rounded-2xl bg-bg-surface px-[var(--padding-5)] py-[var(--padding-3)] text-body-xsmall-mobile text-text-tertiary">
          응급 대처법을 불러오는 중
        </p>
      </section>
    );
  }

  if (isError || !guide) {
    return (
      <section className="flex flex-col gap-[var(--gap-3)]">
        <h2 className="text-heading-xsmall-mobile text-text-primary">해파리 접촉피해 응급 대처법</h2>
        <p className="rounded-2xl bg-bg-surface px-[var(--padding-5)] py-[var(--padding-3)] text-body-xsmall-mobile text-text-tertiary">
          응급 대처법을 불러오지 못했습니다
        </p>
      </section>
    );
  }

  const blocks = splitGuideBlocks(guide.body);

  return (
    <section className="flex flex-col gap-[var(--gap-3)]">
      <h2 className="text-heading-xsmall-mobile text-text-primary">{guide.title}</h2>
      <div className="flex flex-col gap-[var(--gap-3)]">
        {blocks.map((block, index) => (
          <p
            className="whitespace-pre-line rounded-2xl bg-bg-surface px-[var(--padding-5)] py-[var(--padding-3)] text-body-xsmall-mobile text-text-primary"
            key={index}
          >
            {block}
          </p>
        ))}
      </div>
    </section>
  );
}
