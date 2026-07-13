"use client";

import { useMemo, useState } from "react";
import { BottomSheet, Button, WheelPicker } from "@jellysafe/design-system";
import {
  buildDateOptions,
  buildDateTimeColumns,
  partsToDate,
  toDateTimeParts,
  type DateTimeParts,
} from "../utils/date-time-wheel";

export type DateTimeSheetProps = {
  open: boolean;
  value: Date | null;
  onClose: () => void;
  onConfirm: (date: Date) => void;
};

// 발견 일시 선택 바텀시트: 날짜/시/분 휠피커 + 완료
export function DateTimeSheet({ open, value, onClose, onConfirm }: DateTimeSheetProps) {
  const [parts, setParts] = useState<DateTimeParts>(() => toDateTimeParts(value ?? new Date()));

  // 열릴 때마다 현재 값(없으면 지금)으로 초기화(렌더 중 상태 보정 패턴)
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setParts(toDateTimeParts(value ?? new Date()));
    }
  }

  const dateOptions = useMemo(() => buildDateOptions(), [open]); // eslint-disable-line react-hooks/exhaustive-deps -- 열릴 때 기준 날짜 갱신
  const columns = buildDateTimeColumns(parts, dateOptions);

  const handleChange = (key: string, changed: string) => {
    setParts((prev) => ({ ...prev, [key]: changed }));
  };

  const handleConfirm = () => {
    onConfirm(partsToDate(parts));
  };

  return (
    <BottomSheet
      footer={
        <Button className="w-full" onClick={handleConfirm} platform="mobile" variant="primary">
          완료
        </Button>
      }
      onClose={onClose}
      open={open}
      title="날짜와 시간을 선택해주세요"
    >
      {/* Figma wheelpicker 래퍼: py 16만. 제목 간격은 BottomSheet gap-3 */}
      <div className="py-[var(--padding-5)]">
        <WheelPicker columns={columns} onChange={handleChange} />
      </div>
    </BottomSheet>
  );
}
