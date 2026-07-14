"use client";

import { Button } from "@jellysafe/design-system";
import {
  ADMIN_STATUS_LABEL,
  AI_VERDICT_LABEL,
  REPORT_TYPE_LABEL,
  type RejectReason,
  type ReviewDecision,
  type TipOffDetail,
} from "../types";
import { TipOffImageGallery } from "./TipOffImageGallery";
import { TipOffLocation } from "./TipOffLocation";
import { TipOffStatusControl } from "./TipOffStatusControl";

export type TipOffDetailPanelProps = {
  detail: TipOffDetail;
  reviewDecision: ReviewDecision;
  rejectReason: RejectReason;
  onReviewDecisionChange: (decision: ReviewDecision) => void;
  onRejectReasonChange: (reason: RejectReason) => void;
  onImageClick: (index: number) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  isReviewLocked?: boolean;
};

function canSubmitReview(decision: ReviewDecision, reason: RejectReason): boolean {
  if (!decision) return false;
  if (decision === "rejected") return reason !== null;
  return true;
}

export function TipOffDetailPanel({
  detail,
  reviewDecision,
  rejectReason,
  onReviewDecisionChange,
  onRejectReasonChange,
  onImageClick,
  onSubmit,
  isSubmitting = false,
  submitError = null,
  isReviewLocked = false,
}: TipOffDetailPanelProps) {
  const isSubmitEnabled =
    !isReviewLocked && canSubmitReview(reviewDecision, rejectReason) && !isSubmitting;

  return (
    <div className="flex flex-col gap-(--gap-8)">
      <div className="grid grid-cols-1 gap-(--gap-3) xl:grid-cols-[514px_minmax(0,1fr)]">
        <TipOffImageGallery images={detail.images} onImageClick={onImageClick} />
        <TipOffLocation detail={detail} />
      </div>

      <div className="flex flex-col gap-(--gap-3)">
        <h3 className="text-heading-xsmall-pc text-text-primary">제보 유형</h3>
        <p className="text-body-xxsmall-pc text-text-primary">
          {REPORT_TYPE_LABEL[detail.reportType]}
        </p>
      </div>

      <div className="flex flex-col gap-(--gap-3)">
        <div className="flex flex-wrap items-center gap-(--gap-2)">
          <h3 className="text-heading-xsmall-pc text-text-primary">AI 판별 결과</h3>
          <span className="text-body-xsmall-pc text-text-tertiary">
            신뢰도: {detail.confidence}%
          </span>
        </div>
        <p className="text-body-xxsmall-pc text-text-primary">
          {AI_VERDICT_LABEL[detail.aiVerdict]}
        </p>
      </div>

      {isReviewLocked ? (
        <div className="flex flex-col gap-(--gap-3)">
          <p className="text-caption-small-pc text-text-tertiary">
            이미 검수가 완료되었거나 아직 검수할 수 없는 상태입니다. 상태를 변경할 수 없습니다.
          </p>
          <div className="flex flex-col gap-(--gap-3)">
            <h3 className="text-heading-xsmall-pc text-text-primary">현재 상태</h3>
            <p className="text-body-xxsmall-pc text-text-primary">
              {ADMIN_STATUS_LABEL[detail.adminStatus]}
            </p>
          </div>
        </div>
      ) : null}

      <TipOffStatusControl
        disabled={isReviewLocked}
        onRejectReasonChange={onRejectReasonChange}
        onReviewDecisionChange={onReviewDecisionChange}
        rejectReason={rejectReason}
        reviewDecision={reviewDecision}
      />

      {submitError ? (
        <p className="text-caption-small-pc text-text-error">{submitError}</p>
      ) : null}

      {isReviewLocked ? null : (
        <Button
          className="w-full"
          disabled={!isSubmitEnabled}
          onClick={onSubmit}
          size="medium"
          variant="primary"
        >
          {isSubmitting ? "저장 중..." : "검수 완료"}
        </Button>
      )}
    </div>
  );
}
