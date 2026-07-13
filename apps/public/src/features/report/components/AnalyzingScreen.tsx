"use client";

import { LoadingSpinner } from "@jellysafe/design-system";
import { PUBLIC_APP_MAX_WIDTH_CLASS } from "@/shared/ui/public-layout";
import { ChevronLeftIcon } from "./icons";

export type AnalyzingScreenProps = {
  onBack: () => void;
};

// AI 분석 로딩 화면(내비게이션 바 없음)
export function AnalyzingScreen({ onBack }: AnalyzingScreenProps) {
  return (
    <div className={`flex min-h-dvh flex-col bg-bg-default ${PUBLIC_APP_MAX_WIDTH_CLASS}`}>
      <header className="flex items-center gap-(--gap-3) px-(--padding-5) py-(--padding-4)">
        <button
          aria-label="뒤로 가기"
          className="text-text-primary"
          onClick={onBack}
          type="button"
        >
          <ChevronLeftIcon height={24} width={24} />
        </button>
        <h1 className="text-heading-small-mobile text-text-primary">제보 AI 분석</h1>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-(--gap-5)">
        <LoadingSpinner label="AI 분석 중" size={48} />
        <p className="text-body-xxsmall-mobile text-text-tertiary">
          AI가 사진을 통해 해파리를 분석중...
        </p>
      </div>
    </div>
  );
}
