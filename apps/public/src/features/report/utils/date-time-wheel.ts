import type { WheelPickerColumn, WheelPickerOption } from "@jellysafe/design-system";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
/** 오늘부터 과거로 선택 가능한 날짜 수 */
export const DATE_RANGE_DAYS = 30;

const pad = (value: number) => String(value).padStart(2, "0");

export type DateTimeParts = { date: string; hour: string; minute: string };

/** Date → 휠 컬럼 값("YYYY-MM-DD", "HH", "mm") */
export function toDateTimeParts(date: Date): DateTimeParts {
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    hour: pad(date.getHours()),
    minute: pad(date.getMinutes()),
  };
}

export function partsToDate(parts: DateTimeParts): Date {
  const [year, month, day] = parts.date.split("-").map(Number);
  return new Date(year, month - 1, day, Number(parts.hour), Number(parts.minute));
}

/** 오늘 기준 과거 N일 날짜 옵션(과거 → 오늘 순) */
export function buildDateOptions(): WheelPickerOption[] {
  const today = new Date();
  return Array.from({ length: DATE_RANGE_DAYS }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (DATE_RANGE_DAYS - 1 - index));
    const { date: dateValue } = toDateTimeParts(date);
    return {
      value: dateValue,
      label: `${date.getFullYear()} / ${pad(date.getMonth() + 1)} / ${pad(date.getDate())} (${WEEKDAY_LABELS[date.getDay()]})`,
    };
  });
}

export function buildHourOptions(): WheelPickerOption[] {
  return Array.from({ length: 24 }, (_, hour) => ({
    value: pad(hour),
    label: `${pad(hour)}시`,
  }));
}

export function buildMinuteOptions(): WheelPickerOption[] {
  return Array.from({ length: 60 }, (_, minute) => ({
    value: pad(minute),
    label: `${pad(minute)}분`,
  }));
}

export function buildDateTimeColumns(parts: DateTimeParts, dateOptions: WheelPickerOption[]): WheelPickerColumn[] {
  return [
    { key: "date", options: dateOptions, value: parts.date, flex: true, "aria-label": "날짜" },
    { key: "hour", options: buildHourOptions(), value: parts.hour, "aria-label": "시" },
    { key: "minute", options: buildMinuteOptions(), value: parts.minute, "aria-label": "분" },
  ];
}
