"use client";

import { Chip } from "@jellysafe/design-system";
import {
  REJECT_REASON_LABEL,
  REVIEW_DECISION_LABEL,
  type RejectReason,
  type ReviewDecision,
} from "../types";

const REVIEW_OPTIONS: Exclude<ReviewDecision, null>[] = ["approved", "pending", "rejected"];

// Figma 반려 사유 chip 순서: 중복 → 해파리 아님 → 사진 불명확 → 위치 오류
const REJECT_REASON_OPTIONS: Exclude<RejectReason, null>[] = [
  "duplicate",
  "not-jellyfish",
  "unclear-photo",
  "location-error",
];

export type TipOffStatusControlProps = {
  reviewDecision: ReviewDecision;
  rejectReason: RejectReason;
  onReviewDecisionChange: (decision: ReviewDecision) => void;
  onRejectReasonChange: (reason: RejectReason) => void;
};

// 검수 처리 단일 선택 chips. 반려 시 반려 사유 chips를 노출한다.
export function TipOffStatusControl({
  reviewDecision,
  rejectReason,
  onReviewDecisionChange,
  onRejectReasonChange,
}: TipOffStatusControlProps) {
  return (
    <section className="flex flex-col gap-(--gap-8)">
      <div className="flex flex-col gap-(--gap-3)">
        <div className="flex flex-col">
          <h3 className="text-heading-xsmall-pc text-text-primary">검수 처리</h3>
          <p className="text-caption-small-pc text-text-tertiary">
            완료 처리 시 위험도에 반영합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-(--gap-2)">
          {REVIEW_OPTIONS.map((decision) => (
            <Chip
              key={decision}
              onSelectedChange={() =>
                onReviewDecisionChange(reviewDecision === decision ? null : decision)
              }
              selected={reviewDecision === decision}
            >
              {REVIEW_DECISION_LABEL[decision]}
            </Chip>
          ))}
        </div>
      </div>

      {reviewDecision === "rejected" ? (
        <div className="flex flex-col gap-(--gap-3)">
          <div className="flex flex-col">
            <h3 className="text-heading-xsmall-pc text-text-primary">반려 사유</h3>
            <p className="text-caption-small-pc text-text-tertiary">
              반려 처리 시 사유도 같이 기록해주세요.
            </p>
          </div>
          <div className="flex flex-wrap gap-(--gap-2)">
            {REJECT_REASON_OPTIONS.map((reason) => (
              <Chip
                key={reason}
                onSelectedChange={() =>
                  onRejectReasonChange(rejectReason === reason ? null : reason)
                }
                selected={rejectReason === reason}
              >
                {REJECT_REASON_LABEL[reason]}
              </Chip>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
