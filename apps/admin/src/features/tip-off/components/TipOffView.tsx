"use client";

import { Dropdown } from "@jellysafe/design-system";
import { useCallback, useMemo, useState } from "react";
import { clearAdminSession } from "@/features/admin-auth/model/admin-session";
import { ApiError } from "@/shared/api/http-client";
import { CloseIcon } from "@/shared/ui/icons";
import { mapAdminStatus, toReviewRequest } from "../api/mappers";
import { reviewReport } from "../api/reports-api";
import { getTipOffDetail } from "../mocks/tip-off.mock";
import { useTipOffListState } from "../hooks/useTipOffListState";
import {
  SORT_LABEL,
  canReviewReport,
  type ImagePreviewState,
  type RejectReason,
  type ReviewDecision,
  type TipOffScreen,
} from "../types";
import { TipOffDetailHeader } from "./TipOffDetailHeader";
import { TipOffDetailPanel } from "./TipOffDetailPanel";
import { TipOffFilters } from "./TipOffFilters";
import { TipOffImagePreviewModal } from "./TipOffImagePreviewModal";
import { TipOffTable } from "./TipOffTable";

// 단일 라우트에서 목록·상세 뷰를 union 상태로 전환한다.
export function TipOffView() {
  const listState = useTipOffListState();
  const [screen, setScreen] = useState<TipOffScreen>("list");
  const [reviewDecision, setReviewDecision] = useState<ReviewDecision>(null);
  const [rejectReason, setRejectReason] = useState<RejectReason>(null);
  const [imagePreview, setImagePreview] = useState<ImagePreviewState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const selectedRow = useMemo(
    () => listState.rows.find((row) => row.id === listState.selectedId) ?? null,
    [listState.rows, listState.selectedId],
  );

  const detail = selectedRow ? getTipOffDetail(selectedRow) : null;
  const isReviewLocked = selectedRow ? !canReviewReport(selectedRow.reportStatus) : true;

  const previewImages = useMemo(() => {
    if (!imagePreview) return [];
    const row = listState.rows.find(
      (item) => item.id === imagePreview.tipOffId,
    );
    return row ? getTipOffDetail(row).images : [];
  }, [imagePreview, listState.rows]);

  const handleSelectRow = (id: string) => {
    listState.setSelectedId(id);
    setReviewDecision(null);
    setRejectReason(null);
    setReviewError(null);
    setScreen("detail");
  };

  const handleBackToList = useCallback(() => {
    setScreen("list");
    listState.setSelectedId(null);
    setReviewDecision(null);
    setRejectReason(null);
    setReviewError(null);
    setImagePreview(null);
  }, [listState.setSelectedId]);

  const handleSubmitReview = async () => {
    if (!selectedRow || !reviewDecision || isSubmitting || isReviewLocked) return;

    setIsSubmitting(true);
    setReviewError(null);

    try {
      const response = await reviewReport(
        Number(selectedRow.id),
        toReviewRequest(reviewDecision, rejectReason),
      );
      listState.updateRowStatus(
        selectedRow.id,
        mapAdminStatus(response.reportStatus),
        response.reportStatus,
      );
      handleBackToList();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          clearAdminSession();
          window.location.assign("/login");
          return;
        }
        if (error.code === "REPORT_INVALID_TRANSITION") {
          setReviewError("이 상태 변경은 허용되지 않습니다.");
          return;
        }
        const detail = error.code
          ? `[${error.code}] ${error.message}`
          : error.message;
        setReviewError(`검수 저장에 실패했습니다. ${detail}`);
      } else {
        setReviewError("검수 저장에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로드 실패 썸네일 재시도 시 원본 URL로 다시 로드한다.
  const handleRetryThumbnail = (id: string) => {
    const row = listState.rows.find((item) => item.id === id);
    if (!row?.thumbnailSrc) return;
    listState.updateThumbnailState(id, "loaded", row.thumbnailSrc);
  };

  if (screen === "detail" && detail) {
    return (
      <div className="flex flex-col pt-(--gap-8)">
        <TipOffDetailHeader onBack={handleBackToList} />
        <TipOffDetailPanel
          detail={detail}
          isReviewLocked={isReviewLocked}
          onImageClick={(index) =>
            setImagePreview({ tipOffId: detail.id, index })
          }
          onRejectReasonChange={setRejectReason}
          onReviewDecisionChange={(decision) => {
            setReviewDecision(decision);
            setReviewError(null);
            if (decision !== "rejected") {
              setRejectReason(null);
            }
          }}
          onSubmit={handleSubmitReview}
          rejectReason={rejectReason}
          reviewDecision={reviewDecision}
          isSubmitting={isSubmitting}
          submitError={reviewError}
        />
        {imagePreview && imagePreview.tipOffId === detail.id ? (
          <TipOffImagePreviewModal
            images={previewImages}
            index={imagePreview.index}
            onClose={() => setImagePreview(null)}
            onIndexChange={(index) =>
              setImagePreview({ tipOffId: detail.id, index })
            }
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-(--gap-3) pt-(--gap-3)">
      <h2 className="text-heading-xsmall-pc text-text-primary">해파리 제보 검수</h2>

      <div className="flex flex-wrap items-center gap-(--gap-5)">
        <div className="flex min-w-[280px] flex-1 items-center rounded-lg border border-border-default bg-bg-default px-(--padding-5) py-(--padding-4)">
          <input
            aria-label="제보 검색"
            className="min-w-0 flex-1 bg-transparent text-body-xxsmall-pc text-text-primary outline-none placeholder:text-text-tertiary"
            onChange={(event) => listState.setQuery(event.target.value)}
            placeholder="검색어를 입력해주세요"
            type="text"
            value={listState.query}
          />
          {listState.query ? (
            <button
              aria-label="검색어 지우기"
              className="shrink-0 rounded-sm bg-bg-surface p-(--padding-1) text-icon-secondary"
              onClick={() => listState.setQuery("")}
              type="button"
            >
              <CloseIcon className="size-[20px]" />
            </button>
          ) : null}
        </div>

        <Dropdown
          aria-label="정렬"
          menuClassName="right-0 left-auto min-w-full"
          onValueChange={(value) =>
            listState.setSort(value as typeof listState.sort)
          }
          options={[
            { value: "latest", label: SORT_LABEL.latest },
            { value: "oldest", label: SORT_LABEL.oldest },
            { value: "risk-high", label: SORT_LABEL["risk-high"] },
            { value: "risk-low", label: SORT_LABEL["risk-low"] },
          ]}
          value={listState.sort}
        />

        <TipOffFilters
          appliedCount={listState.appliedCount}
          canReset={listState.canReset}
          draft={listState.draftFilter}
          isOpen={listState.isFilterOpen}
          onApply={listState.applyFilter}
          onReset={listState.resetDraft}
          onToggle={listState.toggleFilter}
          onToggleAdminStatus={listState.toggleAdminStatus}
          onToggleAiVerdict={listState.toggleAiVerdict}
          onToggleReportType={listState.toggleReportType}
          onToggleRisk={listState.toggleRisk}
          previewCount={listState.previewCount}
        />
      </div>

      <p className="w-full text-right text-caption-small-pc text-text-tertiary">
        전체: {listState.totalCount}
      </p>

      {listState.isLoading && listState.rows.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-body-xsmall-pc text-text-tertiary">제보 목록을 불러오는 중입니다</p>
        </div>
      ) : listState.isError ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <p className="text-body-xsmall-pc text-text-tertiary">제보 목록을 불러오지 못했습니다</p>
        </div>
      ) : (
        <TipOffTable
          onRetryThumbnail={handleRetryThumbnail}
          onSelect={handleSelectRow}
          rows={listState.visibleRows}
          selectedId={listState.selectedId}
        />
      )}
    </div>
  );
}
