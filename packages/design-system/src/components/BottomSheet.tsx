"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent, PointerEvent, ReactNode, SyntheticEvent } from "react";
import { useScrollIndicator } from "../hooks/useScrollIndicator";

const CLOSE_DRAG_THRESHOLD_PX = 80;

export type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  caption?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

/**
 * Figma bottomsheet: 화면 inset(좌우 8·하단 32) 플로팅 카드, 전체 radius 16.
 * 핸들↔본문 16px, 제목↔콘텐츠·푸터 8px.
 * 상단 핸들 드래그로 닫기 지원(아래로 ≥80px 시 onClose).
 */
export function BottomSheet({
  open,
  onClose,
  title,
  caption,
  footer,
  children,
  className,
  "aria-label": ariaLabel,
}: BottomSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentScrollRef = useScrollIndicator<HTMLDivElement>();
  const titleId = useId();
  const dragStartY = useRef<number | null>(null);
  const dragYRef = useRef(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dragYRef.current = 0;
      setDragY(0);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // 열릴 때 드래그 오프셋 초기화
  useEffect(() => {
    if (open) {
      dragYRef.current = 0;
      setDragY(0);
    }
  }, [open]);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  const handleDragStart = (event: PointerEvent<HTMLDivElement>) => {
    dragStartY.current = event.clientY;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current == null) return;
    // 아래로만 오프셋(음수면 0으로 클램프) — 올리면 다시 붙음
    const next = Math.max(0, event.clientY - dragStartY.current);
    dragYRef.current = next;
    setDragY(next);
  };

  const handleDragEnd = () => {
    if (dragStartY.current == null) return;
    dragStartY.current = null;
    setIsDragging(false);
    const y = dragYRef.current;
    dragYRef.current = 0;
    setDragY(0);
    if (y >= CLOSE_DRAG_THRESHOLD_PX) {
      onClose();
    }
  };

  return (
    <dialog
      aria-label={title ? undefined : ariaLabel}
      aria-labelledby={title ? titleId : undefined}
      className={[
        // 하단·좌우 inset + 전체 라운드(풀폭 docked sheet 아님)
        "inset-x-0 top-auto bottom-0 m-0 mx-auto mb-[var(--padding-8)] w-[calc(100%-16px)] max-w-[414px] rounded-2xl bg-bg-default p-0",
        "shadow-[0_0_24px_0_rgba(8,8,8,0.1)] backdrop:bg-bg-dim",
        isDragging ? "" : "transition-transform duration-200 ease-out",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onCancel={handleCancel}
      onClick={handleClick}
      ref={dialogRef}
      style={{ transform: dragY ? `translateY(${dragY}px)` : undefined }}
    >
      {/* max-h는 80dvh 고정. min(...,100%)의 100%는 auto 높이 dialog 기준이라
          일부 모바일(iOS Safari)에서 0에 가깝게 해석돼 시트가 붕괴했다. */}
      <div className="flex max-h-[80dvh] flex-col gap-[var(--gap-5)] px-[var(--padding-3)] pb-[var(--padding-3)]">
        <div
          aria-label="시트 닫기 핸들"
          className="flex min-h-8 shrink-0 cursor-grab items-center justify-center touch-none pt-[var(--padding-3)] active:cursor-grabbing"
          onPointerCancel={handleDragEnd}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          role="button"
          tabIndex={0}
        >
          <span
            aria-hidden="true"
            className="h-1 w-12 rounded-full bg-border-default"
          />
        </div>

        {/* 제목↔콘텐츠 8px. flex-1로 빈 공간 키우지 않고 콘텐츠 hug */}
        <div className="flex min-h-0 flex-col gap-[var(--gap-3)] overflow-hidden">
          {title || caption ? (
            <div className="flex shrink-0 flex-col gap-[var(--gap-1)] px-[var(--padding-3)]">
              {title ? (
                <h2
                  className="text-heading-xsmall-mobile text-text-primary"
                  id={titleId}
                >
                  {title}
                </h2>
              ) : null}
              {caption ? (
                <p className="text-caption-small-mobile text-text-tertiary">
                  {caption}
                </p>
              ) : null}
            </div>
          ) : null}

          <div
            className="scrollbar-indicator min-h-0 overflow-y-auto"
            ref={contentScrollRef}
          >
            {children}
          </div>

          {footer ? <div className="shrink-0">{footer}</div> : null}
        </div>
      </div>
    </dialog>
  );
}
