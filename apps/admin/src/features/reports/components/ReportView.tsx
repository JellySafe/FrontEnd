"use client";

import { Badge, Button, Card } from "@jellysafe/design-system";
import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { ResponseHistoryItem } from "@/features/detailed-map/components/ResponseHistoryItem";
import { BEACHES } from "@/features/dashboard/mocks/dashboard.mock";
import { RISK_LABEL } from "@/shared/risk/types";
import { useScrollIndicator } from "@/shared/hooks/useScrollIndicator";
import { AdminLargeTextField } from "@/shared/ui/AdminLargeTextField";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@/shared/ui/icons";
import { EMPTY_HOURLY, REPORT_DATA } from "../mocks/reports.mock";
import type { ReportStatus } from "../types";
import { ReportLoadingSkeleton } from "./ReportLoadingSkeleton";

const UP_DOWN_ICON_PATH =
  "M18.2073 9.04256L12.0002 2.83545L5.79312 9.04256L7.20733 10.4568L12.0002 5.66388L16.7931 10.4568L18.2073 9.04256ZM5.79297 14.957L12.0001 21.1641L18.2072 14.957L16.7929 13.5428L12.0001 18.3357L7.20718 13.5428L5.79297 14.957Z";

const STAT_ITEMS = [
  { key: "tipOffCount" as const, label: "제보" },
  { key: "toxicCount" as const, label: "독성 의심" },
  { key: "stingCount" as const, label: "쏘임 사고" },
];

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const SCROLL_THUMB_WIDTH = 80;

function formatDisplayDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${year}.${month}.${day}`;
}

function formatDateValue(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

type MonthCalendarProps = {
  selectedDate: string | null;
  viewYear: number;
  viewMonth: number;
  onSelectDate: (value: string) => void;
  onViewMonthChange: (year: number, month: number) => void;
};

function MonthCalendar({
  selectedDate,
  viewYear,
  viewMonth,
  onSelectDate,
  onViewMonthChange,
}: MonthCalendarProps) {
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const daysInPrevMonth = getDaysInMonth(
    viewMonth === 1 ? viewYear - 1 : viewYear,
    viewMonth === 1 ? 12 : viewMonth - 1,
  );

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      onViewMonthChange(viewYear - 1, 12);
      return;
    }
    onViewMonthChange(viewYear, viewMonth - 1);
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      onViewMonthChange(viewYear + 1, 1);
      return;
    }
    onViewMonthChange(viewYear, viewMonth + 1);
  };

  const dayCells: Array<{ day: number; month: number; year: number; isCurrentMonth: boolean }> =
    [];

  for (let index = 0; index < firstDay; index += 1) {
    const day = daysInPrevMonth - firstDay + index + 1;
    const month = viewMonth === 1 ? 12 : viewMonth - 1;
    const year = viewMonth === 1 ? viewYear - 1 : viewYear;
    dayCells.push({ day, month, year, isCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    dayCells.push({ day, month: viewMonth, year: viewYear, isCurrentMonth: true });
  }

  while (dayCells.length % 7 !== 0) {
    const nextDayIndex = dayCells.length - firstDay - daysInMonth + 1;
    const month = viewMonth === 12 ? 1 : viewMonth + 1;
    const year = viewMonth === 12 ? viewYear + 1 : viewYear;
    dayCells.push({ day: nextDayIndex, month, year, isCurrentMonth: false });
  }

  return (
    <div className="flex w-[280px] flex-col gap-(--gap-3)">
      <div className="flex items-center justify-between">
        <button
          aria-label="이전 달"
          className="flex items-center text-icon-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
          onClick={handlePrevMonth}
          type="button"
        >
          <ChevronLeftIcon className="size-(--icon-size-24)" />
        </button>
        <span className="text-body-xsmall-pc text-text-primary">
          {viewYear}년 {viewMonth}월
        </span>
        <button
          aria-label="다음 달"
          className="flex items-center text-icon-tertiary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
          onClick={handleNextMonth}
          type="button"
        >
          <ChevronRightIcon className="size-(--icon-size-24)" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <span
            className="py-(--padding-1) text-center text-caption-small-pc text-text-tertiary"
            key={label}
          >
            {label}
          </span>
        ))}
        {dayCells.map((cell) => {
          const value = formatDateValue(cell.year, cell.month, cell.day);
          const isSelected = selectedDate === value;

          return (
            <button
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full text-body-xxsmall-pc",
                isSelected
                  ? "bg-bg-strong text-text-inverse"
                  : cell.isCurrentMonth
                    ? "text-text-primary hover:bg-bg-surface"
                    : "text-text-tertiary hover:bg-bg-surface",
              ].join(" ")}
              key={value}
              onClick={() => onSelectDate(value)}
              type="button"
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ReportView() {
  const [date, setDate] = useState<string | null>(null);
  const [beachId, setBeachId] = useState<string | null>(null);
  const [readyKey, setReadyKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [memo, setMemo] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth() + 1);
  const [scrollThumbLeft, setScrollThumbLeft] = useState(0);
  const locationContainerRef = useRef<HTMLDivElement>(null);
  const dateContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const generateTimerRef = useRef<number | null>(null);
  const locationListRef = useScrollIndicator<HTMLUListElement>();
  const locationListId = useId();
  const dateInputId = useId();

  const selectedBeach = useMemo(
    () => BEACHES.find((beach) => beach.id === beachId) ?? null,
    [beachId],
  );

  const filteredBeaches = useMemo(() => {
    const query = locationQuery.trim().toLowerCase();
    if (!query) return BEACHES;
    return BEACHES.filter(
      (beach) =>
        beach.name.toLowerCase().includes(query) ||
        beach.address.toLowerCase().includes(query),
    );
  }, [locationQuery]);

  const filterKey = date && beachId ? `${date}:${beachId}` : null;
  const canGenerate =
    filterKey !== null && filterKey !== readyKey && !isGenerating;

  const status: ReportStatus = isGenerating
    ? "loading"
    : filterKey !== null && filterKey === readyKey
      ? "ready"
      : "empty";

  useEffect(() => {
    return () => {
      if (generateTimerRef.current !== null) {
        window.clearTimeout(generateTimerRef.current);
      }
    };
  }, []);

  const hourly = status === "ready" ? REPORT_DATA.hourly : EMPTY_HOURLY;
  const isReady = status === "ready";

  const updateScrollThumb = useCallback(() => {
    const scrollEl = scrollRef.current;
    const trackEl = scrollTrackRef.current;
    if (!scrollEl || !trackEl) return;

    const maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
    const maxThumbLeft = Math.max(0, trackEl.clientWidth - SCROLL_THUMB_WIDTH);

    if (maxScroll <= 0) {
      setScrollThumbLeft(0);
      return;
    }

    const ratio = scrollEl.scrollLeft / maxScroll;
    setScrollThumbLeft(ratio * maxThumbLeft);
  }, []);

  useEffect(() => {
    if (!isLocationOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!locationContainerRef.current?.contains(event.target as Node)) {
        setIsLocationOpen(false);
        setLocationQuery("");
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isLocationOpen]);

  useEffect(() => {
    if (!isCalendarOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!dateContainerRef.current?.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isCalendarOpen]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    updateScrollThumb();

    const resizeObserver = new ResizeObserver(updateScrollThumb);
    resizeObserver.observe(scrollEl);
    if (scrollTrackRef.current) {
      resizeObserver.observe(scrollTrackRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [hourly, status, updateScrollThumb]);

  const handleSelectBeach = (nextBeachId: string) => {
    setBeachId(nextBeachId);
    setIsLocationOpen(false);
    setLocationQuery("");
  };

  const handleOpenCalendar = () => {
    if (date) {
      const [year, month] = date.split("-").map(Number);
      setViewYear(year);
      setViewMonth(month);
    }
    setIsCalendarOpen((prev) => !prev);
  };

  const handleSelectDate = (value: string) => {
    setDate(value);
    setIsCalendarOpen(false);
  };

  const handleViewMonthChange = (year: number, month: number) => {
    setViewYear(year);
    setViewMonth(month);
  };

  const handleGenerate = () => {
    if (!canGenerate || !filterKey) return;

    setIsGenerating(true);
    if (generateTimerRef.current !== null) {
      window.clearTimeout(generateTimerRef.current);
    }
    generateTimerRef.current = window.setTimeout(() => {
      setReadyKey(filterKey);
      setIsGenerating(false);
      generateTimerRef.current = null;
    }, 400);
  };

  const handleSaveMemo = () => {
    setMemo("");
  };

  return (
    <div className="flex flex-col gap-(--gap-8) pt-(--gap-8) pb-(--padding-10)">
      <div className="flex flex-col gap-(--gap-3)">
        <div className="flex gap-(--gap-3)">
          <div className="relative flex flex-1 flex-col gap-(--gap-2)" ref={dateContainerRef}>
            <label
              className="text-caption-medium-pc text-text-tertiary"
              htmlFor={dateInputId}
            >
              날짜*
            </label>
            <button
              className="flex w-full items-center justify-between rounded-lg border border-border-default bg-bg-default px-(--padding-5) py-(--padding-4) text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
              id={dateInputId}
              onClick={handleOpenCalendar}
              type="button"
            >
              <span
                className={[
                  "min-w-0 flex-1 truncate text-body-xxsmall-pc font-normal",
                  date ? "text-text-primary" : "text-text-tertiary",
                ].join(" ")}
              >
                {date ? formatDisplayDate(date) : "날짜를 선택해주세요"}
              </span>
              <CalendarIcon className="size-(--icon-size-24) shrink-0 text-icon-tertiary" />
            </button>

            {isCalendarOpen ? (
              <div className="absolute top-[calc(100%+8px)] right-0 z-20 rounded-2xl bg-bg-default p-(--padding-5) shadow-[0_0_8px_0_var(--color-alpha-black-10)]">
                <MonthCalendar
                  onSelectDate={handleSelectDate}
                  onViewMonthChange={handleViewMonthChange}
                  selectedDate={date}
                  viewMonth={viewMonth}
                  viewYear={viewYear}
                />
              </div>
            ) : null}
          </div>

          <div className="flex flex-1 flex-col gap-(--gap-2)">
            <p className="text-caption-medium-pc text-text-tertiary">위치*</p>
            <div className="relative w-full" ref={locationContainerRef}>
              <button
                aria-controls={isLocationOpen ? locationListId : undefined}
                aria-expanded={isLocationOpen}
                aria-haspopup="listbox"
                className="flex w-full items-center justify-between rounded-lg border border-border-default bg-bg-default px-(--padding-5) py-(--padding-4) text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
                onClick={() => setIsLocationOpen((prev) => !prev)}
                type="button"
              >
                <span
                  className={[
                    "min-w-0 flex-1 truncate text-body-xxsmall-pc font-normal",
                    selectedBeach ? "text-text-primary" : "text-text-tertiary",
                  ].join(" ")}
                >
                  {selectedBeach?.name ?? "주소를 선택해주세요"}
                </span>
                <svg
                  aria-hidden="true"
                  className="size-(--icon-size-24) shrink-0 text-icon-tertiary"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path d={UP_DOWN_ICON_PATH} fill="currentColor" />
                </svg>
              </button>

              {isLocationOpen ? (
                <div
                  className="absolute top-[calc(100%+8px)] right-0 z-20 flex w-[458px] flex-col gap-[10px] rounded-2xl bg-bg-default p-(--padding-5) shadow-[0_0_8px_0_var(--color-alpha-black-10)]"
                  id={locationListId}
                >
                  <div className="flex w-full items-center gap-(--gap-3) rounded-lg border border-border-default bg-bg-default px-(--padding-5) py-(--padding-4)">
                    <input
                      aria-label="위치 검색"
                      className="min-w-0 flex-1 bg-transparent text-body-xxsmall-pc text-text-primary outline-none placeholder:text-text-tertiary"
                      onChange={(event) => setLocationQuery(event.target.value)}
                      placeholder="내용을 입력해주세요"
                      type="text"
                      value={locationQuery}
                    />
                    <SearchIcon className="size-(--icon-size-24) shrink-0 text-icon-tertiary" />
                  </div>
                  <ul
                    className="scrollbar-indicator h-[342px] w-full overflow-y-auto"
                    ref={locationListRef}
                  >
                    {filteredBeaches.length > 0 ? (
                      filteredBeaches.map((beach, index) => (
                        <li key={beach.id}>
                          {index > 0 ? (
                            <div className="h-px w-full bg-border-default" />
                          ) : null}
                          <button
                            className="flex w-full items-center px-(--padding-5) py-(--padding-4) text-left"
                            onClick={() => handleSelectBeach(beach.id)}
                            type="button"
                          >
                            <span className="text-body-xsmall-pc text-text-primary">
                              {beach.name}
                            </span>
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="px-(--padding-5) py-(--padding-4) text-body-xxsmall-pc text-text-tertiary">
                        검색 결과가 없습니다
                      </li>
                    )}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          disabled={!canGenerate}
          onClick={handleGenerate}
          platform="pc"
          size="medium"
          variant="primary"
        >
          리포트 생성
        </Button>
      </div>

      {status === "loading" ? (
        <ReportLoadingSkeleton />
      ) : (
        <>
          <section className="flex flex-col gap-(--gap-3)">
            <h2 className="text-heading-xsmall-pc text-text-primary">위험도 변화</h2>
            <div className="overflow-hidden rounded-2xl">
              <div
                className="scrollbar-none overflow-x-auto"
                onScroll={updateScrollThumb}
                ref={scrollRef}
              >
                <div className="inline-flex w-max flex-col">
                  <div className="flex h-10 items-center gap-(--gap-7) bg-bg-surface px-(--padding-7)">
                    {hourly.map((item, index) => (
                      <Fragment key={item.hour}>
                        <span className="w-[50px] shrink-0 text-center text-body-xsmall-pc text-text-tertiary">
                          {item.hour}
                        </span>
                        {index < hourly.length - 1 ? (
                          <div className="h-full w-px shrink-0 bg-border-default" />
                        ) : null}
                      </Fragment>
                    ))}
                  </div>
                  <div className="flex items-center gap-(--gap-7) bg-bg-default px-(--padding-7)">
                    {hourly.map((item, index) => (
                      <Fragment key={item.hour}>
                        <div className="flex w-[50px] shrink-0 flex-col items-center">
                          {item.risk ? (
                            <Badge platform="pc" status={item.risk}>
                              {RISK_LABEL[item.risk]}
                            </Badge>
                          ) : null}
                        </div>
                        {index < hourly.length - 1 ? (
                          <div className="h-16 w-px shrink-0 bg-border-default" />
                        ) : null}
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-2 w-full" ref={scrollTrackRef}>
              <div
                className="absolute top-1/2 h-1 w-20 -translate-y-1/2 rounded-lg bg-[var(--color-gray-20)]"
                style={{ left: scrollThumbLeft }}
              />
            </div>
          </section>

          <section className="flex gap-(--gap-3)">
            {STAT_ITEMS.map((item) => (
              <Card
                className="flex flex-1 flex-col gap-(--gap-2) p-(--padding-7)"
                key={item.key}
                variant="surface"
              >
                <p className="text-caption-medium-pc text-text-secondary">{item.label}</p>
                <p
                  className={[
                    "text-heading-xlarge-pc",
                    isReady ? "text-text-primary" : "text-text-tertiary",
                  ].join(" ")}
                >
                  {isReady ? REPORT_DATA.stats[item.key] : "-"}
                </p>
              </Card>
            ))}
          </section>

          <section className="flex flex-col gap-(--gap-3)">
            <h2 className="text-heading-xsmall-pc text-text-primary">주요 위험 원인</h2>
            {isReady ? (
              <Card className="p-(--padding-7)" variant="surface">
                <div className="flex flex-col gap-[12px]">
                  {REPORT_DATA.causes.map((cause) => (
                    <div className="flex flex-col gap-(--gap-3)" key={cause.title}>
                      <span className="inline-flex w-fit items-center rounded-lg bg-bg-default px-(--padding-3) py-(--padding-2) text-body-xsmall-pc text-text-primary">
                        {cause.title}
                      </span>
                      <p className="text-body-xxsmall-pc text-text-secondary">
                        {cause.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="min-h-[348px]" variant="surface" />
            )}
          </section>

          {isReady ? (
            <>
              <section className="flex flex-col gap-(--gap-3)">
                <h2 className="text-heading-xsmall-pc text-text-primary">대응 기록</h2>
                <div className="flex flex-col gap-(--gap-5)">
                  {REPORT_DATA.history.map((entry, index) => (
                    <Fragment key={entry.id}>
                      {index > 0 ? (
                        <div
                          aria-hidden="true"
                          className="h-px w-full bg-border-default"
                        />
                      ) : null}
                      <ResponseHistoryItem entry={entry} />
                    </Fragment>
                  ))}
                </div>
              </section>

              <section className="flex flex-col gap-(--gap-3)">
                <h2 className="text-heading-xsmall-pc text-text-primary">
                  운영 메모
                </h2>
                <AdminLargeTextField
                  actionDisabled={!memo.trim()}
                  actionLabel="저장"
                  aria-label="운영 메모"
                  onAction={handleSaveMemo}
                  onChange={(event) => setMemo(event.target.value)}
                  placeholder="내용을 입력하세요"
                  value={memo}
                />
              </section>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
