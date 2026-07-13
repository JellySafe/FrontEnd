"use client";

import { useLayoutEffect } from "react";
import { useAdminPageHeader } from "@/shared/ui/admin-page-header-context";
import { ChevronLeftIcon } from "@/shared/ui/icons";

export type TipOffDetailHeaderProps = {
  onBack: () => void;
};

// 상세 화면 전용 헤더(뒤로 가기 + 제목). Shell 헤더 슬롯에 주입한다.
export function TipOffDetailHeader({ onBack }: TipOffDetailHeaderProps) {
  const { setPageHeader } = useAdminPageHeader();

  useLayoutEffect(() => {
    setPageHeader(
      <header className="flex items-center gap-(--gap-3) py-(--padding-5)">
        <button
          aria-label="목록으로"
          className="flex shrink-0 items-center text-icon-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
          onClick={onBack}
          type="button"
        >
          <ChevronLeftIcon className="size-[24px]" />
        </button>
        <h1 className="truncate text-heading-small-pc text-text-primary">제보 상세</h1>
      </header>,
    );
    return () => setPageHeader(null);
  }, [onBack, setPageHeader]);

  return null;
}
