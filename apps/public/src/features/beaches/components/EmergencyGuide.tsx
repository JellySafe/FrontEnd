import { EMERGENCY_GUIDE } from "../constants/emergency-guide";

// 응급 대처법 카드 목록. 강조 segment는 색상 span으로 렌더.
export function EmergencyGuide() {
  return (
    // Figma: 제목↔카드·카드 간 모두 8px
    <section className="flex flex-col gap-[var(--gap-3)]">
      <h2 className="text-heading-xsmall-mobile text-text-primary">해파리 접촉피해 응급 대처법</h2>
      <div className="flex flex-col gap-[var(--gap-3)]">
        {EMERGENCY_GUIDE.map((item, itemIndex) => (
          <p
            className={[
              "rounded-2xl bg-bg-surface px-[var(--padding-5)] py-[var(--padding-3)] text-body-xsmall-mobile",
              item.tone === "primary" ? "text-text-primary" : "text-text-secondary",
            ].join(" ")}
            key={itemIndex}
          >
            {item.segments.map((segment, segmentIndex) =>
              segment.emphasis ? (
                <span
                  className={[
                    "text-body-small-mobile",
                    segment.emphasis === "brand"
                      ? "text-text-brand"
                      : "text-[var(--color-critical-50)]",
                  ].join(" ")}
                  key={segmentIndex}
                >
                  {segment.text}
                </span>
              ) : (
                segment.text
              ),
            )}
          </p>
        ))}
      </div>
    </section>
  );
}
