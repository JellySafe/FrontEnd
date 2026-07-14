"use client";

import { Chip } from "@jellysafe/design-system";
import { Fragment, useState } from "react";
import { clearAdminSession } from "@/features/admin-auth/model/admin-session";
import { ApiError } from "@/shared/api/http-client";
import type { OperationStatus } from "@/shared/api/types";
import { AdminLargeTextField } from "@/shared/ui/AdminLargeTextField";
import { recordOperationAction } from "../api/detailed-map-api";
import { RESPONSE_ACTIONS } from "../api/mappers";
import type { ResponseLogEntry } from "../types";
import { ResponseHistoryItem } from "./ResponseHistoryItem";

const SUBMIT_ERROR_MESSAGE =
  "저장을 실패했습니다. 다시 시도해주세요.\n문제가 지속되면 관리자에게 문의해주세요.";

export type ResponseLogProps = {
  beachId: number;
  history: ResponseLogEntry[];
  onHistoryReload: () => void;
  pendingRecommendationId?: number | null;
  onClearPendingRecommendation?: () => void;
};

// 대응 기록 작성 폼 + 이력.
export function ResponseLog({
  beachId,
  history,
  onHistoryReload,
  pendingRecommendationId,
  onClearPendingRecommendation,
}: ResponseLogProps) {
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [memo, setMemo] = useState("");
  const [showActionValidation, setShowActionValidation] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const trimmed = memo.trim();

  const selectAction = (id: string) => {
    setSelectedActionId((prev) => (prev === id ? null : id));
    setShowActionValidation(false);
    setSubmitError(null);
  };

  const handleSave = async () => {
    if (!selectedActionId) {
      setShowActionValidation(true);
      return;
    }

    setIsSaving(true);
    setSubmitError(null);

    try {
      await recordOperationAction({
        beachId,
        operationStatus: selectedActionId as OperationStatus,
        memo: trimmed || undefined,
        recommendationId: pendingRecommendationId ?? undefined,
      });

      setSelectedActionId(null);
      setMemo("");
      setShowActionValidation(false);
      onClearPendingRecommendation?.();
      onHistoryReload();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAdminSession();
        window.location.assign("/login");
        return;
      }
      setSubmitError(SUBMIT_ERROR_MESSAGE);
    } finally {
      setIsSaving(false);
    }
  };

  const fieldState = isSaving ? "loading" : submitError ? "error" : "default";

  return (
    <div className="flex flex-col gap-(--gap-8) pb-(--padding-10)">
      <section className="flex flex-col gap-(--gap-3)">
        <h2 className="text-heading-xsmall-pc text-text-primary">기록 작성</h2>

        <div className="flex flex-col gap-(--gap-5)">
          <div className="flex flex-col gap-(--gap-2)">
            <p className="text-caption-medium-pc text-text-tertiary">수행한 조치*</p>
            <div className="flex flex-wrap gap-(--gap-2)">
              {RESPONSE_ACTIONS.map((action) => (
                <Chip
                  key={action.id}
                  onSelectedChange={() => selectAction(action.id)}
                  selected={selectedActionId === action.id}
                >
                  {action.label}
                </Chip>
              ))}
            </div>
            {showActionValidation ? (
              <p className="text-caption-small-pc text-text-error">수행한 조치를 선택해주세요</p>
            ) : null}
          </div>

          <AdminLargeTextField
            actionDisabled={isSaving || !selectedActionId}
            actionLabel="기록 저장"
            error={submitError ?? undefined}
            label="작성란"
            onAction={handleSave}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="내용을 입력하세요"
            state={fieldState}
            value={memo}
          />
        </div>
      </section>

      <section className="flex flex-col gap-(--gap-3)">
        <h2 className="text-heading-xsmall-pc text-text-primary">이력</h2>
        {history.length === 0 ? (
          <p className="text-body-xsmall-pc text-text-tertiary">이력이 없습니다</p>
        ) : (
          <div className="flex flex-col gap-(--gap-5)">
            {history.map((entry, index) => (
              <Fragment key={entry.id}>
                {index > 0 ? (
                  <div aria-hidden="true" className="h-px w-full bg-border-default" />
                ) : null}
                <ResponseHistoryItem entry={entry} />
              </Fragment>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
