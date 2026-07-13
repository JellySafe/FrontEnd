"use client";

import { Badge, LoadingSpinner } from "@jellysafe/design-system";
import Image from "next/image";
import type { ReactNode } from "react";
import { useScrollIndicator } from "@/shared/hooks/useScrollIndicator";
import { RISK_LABEL } from "@/shared/risk/types";
import { RefreshIcon } from "@/shared/ui/icons";
import {
  ADMIN_STATUS_LABEL,
  AI_VERDICT_LABEL,
  REPORT_TYPE_LABEL,
  type TipOffListItem,
} from "../types";

export type TipOffTableProps = {
  rows: TipOffListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRetryThumbnail: (id: string) => void;
};

/**
 * Figma tip-off 테이블 열 폭 (콘텐츠 기준, 헤더 문구가 잘리지 않게 소폭 보정)
 * thumb 184 | risk 72 | beach 160 | time 140 | type 88 | ai 104 | conf 56 | admin 1fr
 * 열 사이: gap-7(24) + 1px 세로 구분선 + gap-7(24)
 */
const ROW_GRID =
  "grid w-full grid-cols-[184px_1px_72px_1px_160px_1px_140px_1px_88px_1px_104px_1px_56px_1px_minmax(120px,1fr)] items-stretch gap-x-(--gap-7) px-(--padding-7)";

function ColumnDivider() {
  return <div aria-hidden="true" className="w-px bg-border-default" />;
}

function Cell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={["flex items-center", className].filter(Boolean).join(" ")}>{children}</div>
  );
}

function TableRow({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={[ROW_GRID, className].filter(Boolean).join(" ")}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export function TipOffTable({ rows, selectedId, onSelect, onRetryThumbnail }: TipOffTableProps) {
  const tableScrollRef = useScrollIndicator<HTMLDivElement>();

  return (
    <div className="scrollbar-indicator min-w-0 overflow-x-auto" ref={tableScrollRef}>
      <div className="min-w-[1200px]">
        {/* 헤더: 위쪽만 radius, surface 배경, 세로 구분선만 */}
        <TableRow className="h-[40px] rounded-t-lg bg-bg-surface">
          <div aria-hidden="true" />
          <ColumnDivider />
          <Cell className="justify-center">
            <p className="text-body-xsmall-pc text-text-tertiary">위험도</p>
          </Cell>
          <ColumnDivider />
          <Cell>
            <p className="text-body-xsmall-pc text-text-tertiary">해변</p>
          </Cell>
          <ColumnDivider />
          <Cell>
            <p className="text-body-xxsmall-pc text-text-tertiary">접수 시각</p>
          </Cell>
          <ColumnDivider />
          <Cell>
            <p className="text-body-xsmall-pc text-text-tertiary">제보 유형</p>
          </Cell>
          <ColumnDivider />
          <Cell className="justify-center">
            <p className="text-body-xxsmall-pc text-text-tertiary">AI 판별 결과</p>
          </Cell>
          <ColumnDivider />
          <Cell className="justify-center">
            <p className="text-body-xxsmall-pc text-text-tertiary">신뢰도</p>
          </Cell>
          <ColumnDivider />
          <Cell>
            <p className="text-body-xxsmall-pc text-text-tertiary">관리자 확인</p>
          </Cell>
        </TableRow>

        {rows.length === 0 ? (
          <p className="px-(--padding-7) py-(--padding-10) text-center text-caption-small-pc text-text-tertiary">
            검색 결과가 없습니다.
          </p>
        ) : (
          rows.map((row) => {
            const isSelected = row.id === selectedId;
            return (
              <TableRow
                className={[
                  "h-[158px] cursor-pointer hover:bg-bg-default",
                  isSelected ? "bg-bg-surface hover:bg-bg-surface" : "bg-bg-default",
                ].join(" ")}
                key={row.id}
                onClick={() => onSelect(row.id)}
              >
                <Cell>
                  <ThumbnailCell onRetry={() => onRetryThumbnail(row.id)} row={row} />
                </Cell>
                <ColumnDivider />
                <Cell className="justify-center">
                  <Badge status={row.risk}>{RISK_LABEL[row.risk]}</Badge>
                </Cell>
                <ColumnDivider />
                <Cell>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-body-xsmall-pc text-text-primary">{row.beach}</span>
                    <span className="truncate text-caption-small-pc text-text-tertiary">
                      {row.address}
                    </span>
                  </div>
                </Cell>
                <ColumnDivider />
                <Cell>
                  <p className="text-body-xxsmall-pc text-text-tertiary">{row.receivedAt}</p>
                </Cell>
                <ColumnDivider />
                <Cell>
                  <p className="text-body-xsmall-pc text-text-brand">
                    {REPORT_TYPE_LABEL[row.reportType]}
                  </p>
                </Cell>
                <ColumnDivider />
                <Cell>
                  <p className="text-body-xxsmall-pc text-text-secondary">
                    {AI_VERDICT_LABEL[row.aiVerdict]}
                  </p>
                </Cell>
                <ColumnDivider />
                <Cell className="justify-center">
                  <p className="text-body-xxsmall-pc text-text-tertiary">{row.confidence}%</p>
                </Cell>
                <ColumnDivider />
                <Cell>
                  <p className="text-body-xsmall-pc text-text-tertiary">
                    {ADMIN_STATUS_LABEL[row.adminStatus]}
                  </p>
                </Cell>
              </TableRow>
            );
          })
        )}
      </div>
    </div>
  );
}

function ThumbnailCell({
  row,
  onRetry,
}: {
  row: TipOffListItem;
  onRetry: () => void;
}) {
  if (row.thumbnailState === "error") {
    return (
      <div className="flex h-[138px] w-[184px] flex-col items-center justify-center gap-(--gap-3) overflow-clip rounded-lg bg-bg-muted">
        <p className="text-center text-caption-medium-pc text-text-secondary">다시 시도</p>
        <button
          aria-label="다시 시도"
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
          onClick={(event) => {
            event.stopPropagation();
            onRetry();
          }}
          type="button"
        >
          <RefreshIcon className="size-[20px] text-icon-secondary" />
        </button>
      </div>
    );
  }

  if (row.thumbnailState === "loading") {
    return (
      <div className="flex h-[138px] w-[184px] flex-col items-center justify-center gap-(--gap-3) overflow-clip rounded-lg bg-bg-surface">
        <p className="text-center text-caption-medium-pc text-text-tertiary">
          이미지 불러오는 중...
        </p>
        <LoadingSpinner size={24} />
      </div>
    );
  }

  if (row.thumbnailState === "empty" || !row.thumbnailSrc) {
    return (
      <div className="h-[138px] w-[184px] rounded-lg border border-border-default bg-[repeating-conic-gradient(var(--color-bg-surface)_0%_25%,var(--color-bg-default)_0%_50%)] bg-size-[12px_12px]" />
    );
  }

  return (
    <div className="relative h-[138px] w-[184px] overflow-hidden rounded-lg bg-bg-surface">
      <Image
        alt={`${row.title} 썸네일`}
        className="object-cover"
        fill
        sizes="184px"
        src={row.thumbnailSrc}
      />
    </div>
  );
}
