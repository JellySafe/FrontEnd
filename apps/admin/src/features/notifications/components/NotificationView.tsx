"use client";

import { Chip, Tabs, Toast } from "@jellysafe/design-system";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { clearAdminSession } from "@/features/admin-auth/model/admin-session";
import { getAdminBeaches } from "@/features/beaches/api/beaches-api";
import {
  getAdminBeachRisk,
  getLatestRisks,
} from "@/features/dashboard/api/dashboard-api";
import { ApiError } from "@/shared/api/http-client";
import type { BackendRiskLevel } from "@/shared/api/types";
import { useScrollIndicator } from "@/shared/hooks/useScrollIndicator";
import { formatDateTime, toRiskLevel } from "@/shared/risk/mappers";
import { AdminLargeTextField } from "@/shared/ui/AdminLargeTextField";
import { SearchIcon } from "@/shared/ui/icons";
import { getAdminNotifications, sendNotification } from "../api/notifications-api";
import { buildBackendRiskByBeachId, toNotificationItem } from "../api/mappers";
import {
  RECIPIENT_OPTIONS,
  type NotificationItem,
  type NotificationRecipient,
  type NotificationTab,
} from "../types";
import { NotificationAlarmCard } from "./NotificationAlarmCard";

const UP_DOWN_ICON_PATH =
  "M18.2073 9.04256L12.0002 2.83545L5.79312 9.04256L7.20733 10.4568L12.0002 5.66388L16.7931 10.4568L18.2073 9.04256ZM5.79297 14.957L12.0001 21.1641L18.2072 14.957L16.7929 13.5428L12.0001 18.3357L7.20718 13.5428L5.79297 14.957Z";

const TITLE_MAX_LENGTH = 40;
const GENERATE_ERROR_MESSAGE = "생성을 실패했습니다. 다시 시도해 주세요.";
const DUPLICATE_STAFF_NOTIFICATION_MESSAGE =
  "동일 조건의 알림이 이미 있어 추가 발송되지 않았습니다.";
const INBOX_REFETCH_DELAY_MS = 500;
const COPY_TOAST_MESSAGE = "해당 알림 내용을 복사 했습니다";
const COPY_TOAST_DURATION_MS = 2500;
const COPY_TOAST_EXIT_MS = 600;

type BeachOption = {
  id: string;
  name: string;
  region: string;
};

function handleUnauthorized(error: unknown): boolean {
  if (error instanceof ApiError && error.status === 401) {
    clearAdminSession();
    window.location.assign("/login");
    return true;
  }
  return false;
}

function formatApiErrorDetail(error: unknown): string | null {
  if (error instanceof ApiError && error.message) {
    return error.message;
  }
  return null;
}

async function resolveBackendRiskLevel(
  beachId: number,
  riskByBeachId: Map<number, BackendRiskLevel>,
): Promise<BackendRiskLevel> {
  const cached = riskByBeachId.get(beachId);
  if (cached) return cached;

  const beachRisk = await getAdminBeachRisk(beachId);
  const nowCard = beachRisk.cards.find((card) => card.horizon === "now");
  return nowCard?.riskLevel ?? "safe";
}

export function NotificationView() {
  const [activeTab, setActiveTab] = useState<NotificationTab>("compose");
  const [hasUnread, setHasUnread] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [inbox, setInbox] = useState<NotificationItem[]>([]);
  const [isInboxLoading, setIsInboxLoading] = useState(true);
  const [isInboxError, setIsInboxError] = useState(false);
  const [beaches, setBeaches] = useState<BeachOption[]>([]);
  const [riskByBeachId, setRiskByBeachId] = useState<Map<number, BackendRiskLevel>>(
    () => new Map(),
  );
  const [recipients, setRecipients] = useState<NotificationRecipient[]>([]);
  const [selectedBeachId, setSelectedBeachId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [isCopyToastOpen, setIsCopyToastOpen] = useState(false);
  const [isCopyToastLeaving, setIsCopyToastLeaving] = useState(false);
  const [copyToastKey, setCopyToastKey] = useState(0);
  const locationContainerRef = useRef<HTMLDivElement>(null);
  const locationListRef = useScrollIndicator<HTMLUListElement>();
  const copyToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyToastExitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const locationListId = useId();

  const loadInbox = useCallback(async () => {
    const response = await getAdminNotifications({ page: 1, size: 50 });
    const fetched = response.items.map(toNotificationItem);
    let merged: NotificationItem[] = fetched;

    setInbox((prev) => {
      const fetchedIds = new Set(fetched.map((item) => item.id));
      const localOnly = prev.filter((item) => !fetchedIds.has(item.id));
      merged = [...localOnly, ...fetched];
      return merged;
    });
    setHasUnread(merged.some((item) => item.isUnread));
    setIsInboxError(false);
    return merged;
  }, []);

  useEffect(() => {
    let cancelled = false;

    setIsInboxLoading(true);
    setIsInboxError(false);

    loadInbox()
      .catch((error) => {
        if (cancelled) return;
        if (handleUnauthorized(error)) return;
        setIsInboxError(true);
      })
      .finally(() => {
        if (!cancelled) setIsInboxLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [loadInbox]);

  useEffect(() => {
    let cancelled = false;

    getAdminBeaches()
      .then((items) => {
        if (cancelled) return;
        setBeaches(
          items.map((beach) => ({
            id: String(beach.beachId),
            name: beach.name,
            region: beach.region,
          })),
        );
      })
      .catch((error) => {
        if (cancelled) return;
        handleUnauthorized(error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    getLatestRisks("now")
      .then((items) => {
        if (cancelled) return;
        setRiskByBeachId(buildBackendRiskByBeachId(items));
      })
      .catch((error) => {
        if (cancelled) return;
        handleUnauthorized(error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedBeach = useMemo(
    () => beaches.find((beach) => beach.id === selectedBeachId) ?? null,
    [beaches, selectedBeachId],
  );

  const selectedBeachRisk = useMemo(() => {
    if (!selectedBeachId) return undefined;
    const backendRisk = riskByBeachId.get(Number(selectedBeachId));
    return backendRisk ? toRiskLevel(backendRisk) : undefined;
  }, [riskByBeachId, selectedBeachId]);

  const filteredBeaches = useMemo(() => {
    const query = locationQuery.trim().toLowerCase();
    if (!query) return beaches;
    return beaches.filter(
      (beach) =>
        beach.name.toLowerCase().includes(query) ||
        beach.region.toLowerCase().includes(query),
    );
  }, [beaches, locationQuery]);

  const trimmedTitle = title.trim();
  const trimmedBody = body.trim();
  const canGenerate =
    recipients.length >= 1 &&
    selectedBeach !== null &&
    trimmedTitle.length > 0 &&
    trimmedBody.length > 0 &&
    !isSending;

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

  const handleTabChange = (value: string) => {
    const tab = value as NotificationTab;
    setActiveTab(tab);
    if (tab === "inbox") {
      setHasUnread(false);

      if (inbox.length === 0) {
        setIsInboxLoading(true);
      }
      setIsInboxError(false);

      loadInbox()
        .catch((error) => {
          if (handleUnauthorized(error)) return;
          setIsInboxError(true);
        })
        .finally(() => {
          setIsInboxLoading(false);
        });
    }
  };

  const toggleRecipient = (value: NotificationRecipient) => {
    clearGenerateError();
    setRecipients((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const handleSelectBeach = (beachId: string) => {
    clearGenerateError();
    setSelectedBeachId(beachId);
    setIsLocationOpen(false);
    setLocationQuery("");
  };

  const resetForm = () => {
    setRecipients([]);
    setSelectedBeachId(null);
    setTitle("");
    setBody("");
    setIsLocationOpen(false);
    setLocationQuery("");
    setGenerateError(null);
  };

  const clearGenerateError = () => {
    if (generateError) setGenerateError(null);
  };

  const handleGenerate = async () => {
    if (!canGenerate || !selectedBeachId || isGenerated || isSending) return;

    setIsSending(true);
    setGenerateError(null);

    try {
      const beachId = Number(selectedBeachId);
      const riskLevel = await resolveBackendRiskLevel(beachId, riskByBeachId);

      const results = await Promise.allSettled(
        recipients.map((recipient) =>
          sendNotification({
            targetType: recipient,
            beachId,
            title: trimmedTitle,
            message: trimmedBody,
            eventType: "level_up",
            riskLevel,
          }),
        ),
      );

      const failures = results.filter((result) => result.status === "rejected");
      if (failures.length > 0) {
        const firstFailure = failures[0];
        if (firstFailure.status === "rejected" && handleUnauthorized(firstFailure.reason)) {
          return;
        }

        const detail =
          firstFailure.status === "rejected"
            ? formatApiErrorDetail(firstFailure.reason)
            : null;
        setGenerateError(
          detail ? `${GENERATE_ERROR_MESSAGE} (${detail})` : GENERATE_ERROR_MESSAGE,
        );
        return;
      }

      const optimisticItems: NotificationItem[] = [];
      results.forEach((result, index) => {
        if (result.status !== "fulfilled") return;

        const recipient = recipients[index];
        if (recipient !== "admin" && recipient !== "operator") return;

        const { created, notificationId } = result.value;
        if (!created || notificationId == null) return;

        optimisticItems.push({
          id: String(notificationId),
          locationLabel: selectedBeach.name,
          title: trimmedTitle,
          body: trimmedBody,
          createdAt: formatDateTime(new Date().toISOString()),
          risk: selectedBeachRisk ?? "safe",
          isUnread: true,
        });
      });

      if (optimisticItems.length > 0) {
        setInbox((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = optimisticItems.filter((item) => !existingIds.has(item.id));
          if (newItems.length === 0) return prev;
          return [...newItems, ...prev];
        });
        setHasUnread(true);
      }

      const staffAttempts = results
        .map((result, index) => ({ result, recipient: recipients[index] }))
        .filter(
          ({ recipient }) => recipient === "admin" || recipient === "operator",
        );

      const allStaffSkipped =
        staffAttempts.length > 0 &&
        staffAttempts.every(
          ({ result }) =>
            result.status === "fulfilled" && result.value.created === false,
        );

      if (allStaffSkipped && optimisticItems.length === 0) {
        setGenerateError(DUPLICATE_STAFF_NOTIFICATION_MESSAGE);
      }

      setIsGenerated(true);

      const refreshInboxQuietly = () => {
        void loadInbox().catch((error) => {
          if (handleUnauthorized(error)) return;
        });
      };
      refreshInboxQuietly();
      window.setTimeout(refreshInboxQuietly, INBOX_REFETCH_DELAY_MS);
    } catch (error) {
      if (handleUnauthorized(error)) return;

      const detail = formatApiErrorDetail(error);
      setGenerateError(
        detail ? `${GENERATE_ERROR_MESSAGE} (${detail})` : GENERATE_ERROR_MESSAGE,
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleStartNew = () => {
    resetForm();
    setIsGenerated(false);
  };

  const handleCopyPreview = () => {
    if (copyToastTimerRef.current) {
      clearTimeout(copyToastTimerRef.current);
    }
    if (copyToastExitTimerRef.current) {
      clearTimeout(copyToastExitTimerRef.current);
    }

    setIsCopyToastLeaving(false);
    setIsCopyToastOpen(true);
    setCopyToastKey((prev) => prev + 1);

    copyToastTimerRef.current = setTimeout(() => {
      setIsCopyToastLeaving(true);
      copyToastTimerRef.current = null;

      copyToastExitTimerRef.current = setTimeout(() => {
        setIsCopyToastOpen(false);
        setIsCopyToastLeaving(false);
        copyToastExitTimerRef.current = null;
      }, COPY_TOAST_EXIT_MS);
    }, COPY_TOAST_DURATION_MS);
  };

  useEffect(() => {
    return () => {
      if (copyToastTimerRef.current) {
        clearTimeout(copyToastTimerRef.current);
      }
      if (copyToastExitTimerRef.current) {
        clearTimeout(copyToastExitTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col gap-(--gap-5) pt-(--gap-8)">
      {isCopyToastOpen ? (
        <div
          key={copyToastKey}
          className={[
            "pointer-events-none fixed top-(--padding-8) left-0 z-50 flex w-full justify-center pl-14",
            isCopyToastLeaving
              ? "animate-toast-slide-out"
              : "animate-toast-slide-in",
          ].join(" ")}
        >
          <Toast>{COPY_TOAST_MESSAGE}</Toast>
        </div>
      ) : null}

      <Tabs
        aria-label="알림 탭"
        items={[
          { value: "compose", label: "알림 작성" },
          { value: "inbox", label: "받은 알림", hasNew: hasUnread },
        ]}
        onValueChange={handleTabChange}
        value={activeTab}
        variant="line"
      />

      {activeTab === "compose" ? (
        <div className="flex min-h-0 flex-1 flex-col gap-(--gap-5)">
          <div className="flex flex-col gap-(--gap-2)">
            <p className="text-caption-medium-pc text-text-tertiary">
              알림 미리보기
            </p>
            <NotificationAlarmCard
              body={body}
              copyActive={isGenerated}
              locationLabel={selectedBeach?.name ?? ""}
              onCopy={handleCopyPreview}
              risk={selectedBeachRisk}
              title={title}
              variant="preview"
            />
          </div>

          <div className="flex flex-col gap-(--gap-2)">
            <p className="text-caption-medium-pc text-text-tertiary">받는 사람*</p>
            <div className="flex flex-wrap gap-(--gap-2)">
              {RECIPIENT_OPTIONS.map((option) => (
                <Chip
                  key={option.value}
                  disabled={isSending}
                  onSelectedChange={() => toggleRecipient(option.value)}
                  selected={recipients.includes(option.value)}
                >
                  {option.label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-(--gap-2)">
            <p className="text-caption-medium-pc text-text-tertiary">위치</p>
            <div className="relative w-full" ref={locationContainerRef}>
              <button
                aria-controls={isLocationOpen ? locationListId : undefined}
                aria-expanded={isLocationOpen}
                aria-haspopup="listbox"
                className="flex w-full items-center justify-between rounded-lg border border-border-default bg-bg-default px-(--padding-5) py-(--padding-4) text-left font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
                disabled={isSending}
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
                  className="size-(--icon-size-24) shrink-0 text-icon-secondary"
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
                    <SearchIcon className="size-(--icon-size-24) shrink-0 text-icon-secondary" />
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

          <div className="flex flex-col gap-(--gap-2)">
            <label
              className="text-caption-medium-pc text-text-tertiary"
              htmlFor="notification-title"
            >
              제목
            </label>
            <input
              className="w-full rounded-lg border border-border-default bg-bg-default px-(--padding-5) py-(--padding-4) text-body-xxsmall-pc text-text-primary outline-none placeholder:text-text-tertiary focus-visible:border-border-brand"
              disabled={isSending}
              id="notification-title"
              maxLength={TITLE_MAX_LENGTH}
              onChange={(event) => {
                clearGenerateError();
                setTitle(event.target.value);
              }}
              placeholder="생성 버튼을 눌러주세요"
              type="text"
              value={title}
            />
          </div>

          <AdminLargeTextField
            actionDisabled={isGenerated ? false : !canGenerate}
            actionLabel={isGenerated ? "새 알림 작성" : "생성"}
            actionVariant={isGenerated ? "secondary" : "primary"}
            className="min-h-0 h-auto flex-1"
            disabled={isSending}
            error={generateError ?? undefined}
            label="상세 설명"
            onAction={isGenerated ? handleStartNew : handleGenerate}
            onChange={(event) => {
              clearGenerateError();
              setBody(event.target.value);
            }}
            placeholder="생성 버튼을 눌러주세요"
            state={generateError ? "error" : isSending ? "loading" : "default"}
            value={body}
          />
        </div>
      ) : (
        <div className="scrollbar-none flex min-h-0 flex-1 flex-col gap-(--gap-5) overflow-y-auto">
          {isInboxLoading && inbox.length === 0 ? (
            <p className="text-body-xsmall-pc text-text-tertiary">
              알림을 불러오는 중입니다
            </p>
          ) : isInboxError && inbox.length === 0 ? (
            <p className="text-body-xsmall-pc text-text-tertiary">
              알림을 불러오지 못했습니다
            </p>
          ) : inbox.length === 0 ? (
            <p className="text-body-xsmall-pc text-text-tertiary">
              받은 알림이 없습니다
            </p>
          ) : (
            inbox.map((item) => (
              <NotificationAlarmCard
                key={item.id}
                body={item.body}
                createdAt={item.createdAt}
                locationLabel={item.locationLabel}
                risk={item.risk}
                title={item.title}
                variant="inbox"
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
