"use client";

import { Badge, Button } from "@jellysafe/design-system";
import { useRouter } from "next/navigation";
import { useScrollIndicator } from "@/shared/hooks/useScrollIndicator";
import { RiskPredictionChart } from "@/shared/risk/RiskPredictionChart";
import { CloseIcon } from "@/shared/ui/icons";
import { RISK_LABEL } from "../types";
import type { BeachDetail } from "../types";

export type DashboardDetailPanelProps = {
  detail: BeachDetail;
  onClose: () => void;
};

export function DashboardDetailPanel({ detail, onClose }: DashboardDetailPanelProps) {
  const router = useRouter();
  const scrollRef = useScrollIndicator<HTMLDivElement>();

  // 바깥 프레임만 overflow clip → 지도 래퍼 overflow-hidden을 쓰지 않아 pan 시 왼쪽 깜빡임 방지
  return (
    <div className="absolute top-[16px] bottom-[16px] left-[16px] z-40 w-[400px] overflow-hidden">
      <div className="animate-panel-slide-up relative flex h-full flex-col overflow-hidden rounded-lg bg-bg-default shadow-[0_0_4px_var(--color-alpha-black-5)]">
        <div
          className="scrollbar-indicator flex min-h-0 flex-1 flex-col gap-(--gap-5) overflow-y-auto p-(--padding-7) pb-[88px]"
          ref={scrollRef}
        >
          <div className="flex items-center gap-(--gap-2)">
            <Badge status={detail.risk}>{RISK_LABEL[detail.risk]}</Badge>
            <p className="min-w-0 flex-1 truncate text-heading-xsmall-pc text-text-primary">{detail.name}</p>
            <button aria-label="상세 닫기" className="text-icon-primary" onClick={onClose} type="button">
              <CloseIcon className="size-[24px]" />
            </button>
          </div>

          <div className="flex flex-col gap-(--gap-2)">
            <p className="truncate text-caption-small-pc text-text-tertiary">{detail.address}</p>
            <div className="flex flex-wrap items-center gap-(--gap-2) text-caption-small-pc text-text-tertiary">
              <span className="flex gap-(--gap-2)">
                <span>예측 생성</span>
                <span>{detail.createdAt}</span>
              </span>
              <span className="h-[20px] w-px bg-border-default" />
              <span className="flex gap-(--gap-2)">
                <span>데이터 수집</span>
                <span>{detail.collectedAt}</span>
              </span>
            </div>
          </div>

          <section className="flex flex-col gap-(--gap-3)">
            <h3 className="text-heading-xsmall-pc text-text-primary">시간별 위험도 예측</h3>
            <RiskPredictionChart hourly={detail.hourly} />
          </section>
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-bg-default px-(--padding-7) pt-(--padding-3) pb-(--padding-5)">
          <Button
            className="w-full"
            onClick={() => router.push(`/dashboard/detailed-map?beach=${detail.id}`)}
            platform="pc"
            size="medium"
            type="button"
            variant="primary"
          >
            이동
          </Button>
        </div>
      </div>
    </div>
  );
}
