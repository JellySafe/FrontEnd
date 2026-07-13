import { notFound } from "next/navigation";
import { AlternativeBeaches } from "@/features/beaches/components/AlternativeBeaches";
import { PUBLIC_APP_MAX_WIDTH_CLASS } from "@/shared/ui/public-layout";
import { BeachDetailHeader } from "@/features/beaches/components/BeachDetailHeader";
import { EmergencyGuide } from "@/features/beaches/components/EmergencyGuide";
import { RiskCauseSection } from "@/features/beaches/components/RiskCauseSection";
import { RiskGuideBanner } from "@/features/beaches/components/RiskGuideBanner";
import { RiskPredictionChart } from "@/features/beaches/components/RiskPredictionChart";
import { getBeachById } from "@/shared/mocks/beaches.mock";

export default async function BeachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const beach = getBeachById(id);
  if (!beach) {
    notFound();
  }

  // 대체 해변: id 배열 -> 상세 조회 후 undefined 제거
  const alternatives = beach.alternativeBeachIds
    .map(getBeachById)
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    // Figma beaches/focused: 헤더↔본문 20px, 섹션 간 24px, 제목↔내용 8px
    <main className={`${PUBLIC_APP_MAX_WIDTH_CLASS} bg-bg-default pb-[var(--padding-8)]`}>
      <BeachDetailHeader beachId={beach.id} name={beach.name} risk={beach.risk} />
      <div className="flex flex-col gap-[var(--gap-7)] px-[var(--padding-5)] pt-[var(--gap-6)]">
        <RiskGuideBanner risk={beach.risk} />
        <section className="flex flex-col gap-[var(--gap-3)]">
          <h2 className="text-heading-xsmall-mobile text-text-primary">시간별 위험도 예측</h2>
          <RiskPredictionChart hourly={beach.hourly} />
        </section>
        <RiskCauseSection causesByTime={beach.causesByTime} />
        <EmergencyGuide />
        <AlternativeBeaches beaches={alternatives} />
      </div>
    </main>
  );
}
