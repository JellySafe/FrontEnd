"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@jellysafe/design-system";
import { ImageUploadTile } from "@/shared/ui/ImageUploadTile";
import { NavigationBar } from "@/shared/ui/NavigationBar";
import { PublicPageShell } from "@/shared/ui/PublicPageShell";
import { PUBLIC_NAV_ITEMS } from "@/shared/ui/navigation-items";
import { REPORT_TYPE_LABEL } from "../types";
import type { ReportLocation, ReportSubmitPayload, ReportType } from "../types";
import { formatReportDateTime } from "../utils/format-date-time";
import { CurrentLocationScreen } from "@/features/location/components/CurrentLocationScreen";
import { AddressSearchSheet } from "./AddressSearchSheet";
import { DateTimeSheet } from "./DateTimeSheet";
import { CheckCircleIcon, CircleBlankIcon, UpDownIcon } from "./icons";

const MAX_IMAGE_COUNT = 3;
const REPORT_TYPES: ReportType[] = ["sighting", "swarm", "sting"];

type ReportImage = { id: string; previewUrl: string; file: File };

// 값 유무에 따라 placeholder/값 표시를 전환하는 선택 필드
function SelectField({
  label,
  placeholder,
  value,
  onClick,
}: {
  label: string;
  placeholder: string;
  value: string | null;
  onClick: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-(--gap-2)">
      <span className="text-caption-medium-mobile text-text-tertiary">{label}</span>
      <button
        className="flex w-full items-center gap-(--gap-3) rounded-lg border border-border-default bg-bg-default px-(--padding-5) py-(--padding-4) text-left"
        onClick={onClick}
        type="button"
      >
        <span
          className={[
            "min-w-0 flex-1 truncate text-body-xxsmall-mobile",
            value ? "text-text-primary" : "text-text-tertiary",
          ].join(" ")}
        >
          {value ?? placeholder}
        </span>
        <UpDownIcon className="size-(--icon-size-24) shrink-0 text-icon-secondary" />
      </button>
    </div>
  );
}

// 개인정보 동의 라디오 행
function ConsentRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      aria-pressed={checked}
      className="flex items-center gap-(--gap-1)"
      onClick={onToggle}
      type="button"
    >
      <span className="flex items-center p-(--padding-2)">
        {checked ? (
          <CheckCircleIcon className="size-(--icon-size-20) text-icon-brand" />
        ) : (
          <CircleBlankIcon className="size-(--icon-size-20) text-icon-secondary" />
        )}
      </span>
      <span className="text-body-xxsmall-mobile text-text-secondary">{label}</span>
    </button>
  );
}

export type ReportFormProps = {
  onSubmit: (payload: ReportSubmitPayload) => void;
};

// 해파리 제보 폼: 이미지/위치/일시/유형/동의 입력 후 제출
export function ReportForm({ onSubmit }: ReportFormProps) {
  const [images, setImages] = useState<ReportImage[]>([]);
  const [location, setLocation] = useState<ReportLocation | null>(null);
  const [discoveredAt, setDiscoveredAt] = useState<Date | null>(null);
  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [hasCollectConsent, setHasCollectConsent] = useState(false);
  const [hasReviewConsent, setHasReviewConsent] = useState(false);
  const [openSheet, setOpenSheet] = useState<"address" | "datetime" | null>(null);
  const [isCurrentLocationMapOpen, setIsCurrentLocationMapOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<ReportImage[]>([]);

  // 언마운트 시 미리보기 URL 해제
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) {
      setImages((prev) => [
        ...prev,
        ...files.slice(0, MAX_IMAGE_COUNT - prev.length).map((file) => ({
          id: crypto.randomUUID(),
          previewUrl: URL.createObjectURL(file),
          file,
        })),
      ]);
    }
    event.target.value = "";
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const removed = prev.find((image) => image.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((image) => image.id !== id);
    });
  };

  const canSubmit =
    images.length > 0 &&
    location !== null &&
    discoveredAt !== null &&
    reportType !== null &&
    hasCollectConsent &&
    hasReviewConsent;

  const handleSubmit = () => {
    if (!location || !discoveredAt || !reportType || images.length === 0) return;
    onSubmit({
      locationName: location.name,
      discoveredAt,
      reportType,
      imageFile: images[0].file,
      location,
    });
  };

  return (
    <>
      <PublicPageShell
        contentClassName="flex flex-col gap-(--gap-5) px-(--padding-5) pt-(--padding-8)"
        footer={<NavigationBar activeKey="report" items={PUBLIC_NAV_ITEMS} />}
      >
        {/* 이미지 업로드 */}
        <div className="flex w-full flex-col gap-(--gap-2)">
          <span className="text-caption-medium-mobile text-text-tertiary">이미지*</span>
          <div className="flex items-start gap-(--gap-2)">
            {images.length < MAX_IMAGE_COUNT ? (
              <ImageUploadTile onAdd={() => fileInputRef.current?.click()} />
            ) : null}
            {images.map((image) => (
              <ImageUploadTile
                imageAlt="제보 이미지 미리보기"
                imageSrc={image.previewUrl}
                key={image.id}
                onRemove={() => handleRemoveImage(image.id)}
              />
            ))}
          </div>
          <input
            accept="image/*"
            className="hidden"
            multiple
            onChange={handleFilesChange}
            ref={fileInputRef}
            type="file"
          />
        </div>

        {/* 발견 위치 */}
        <SelectField
          label="발견 위치*"
          onClick={() => setOpenSheet("address")}
          placeholder="주소를 선택해주세요"
          value={location?.name ?? null}
        />

        {/* 발견 일시 + 지금으로 설정 */}
        <div className="flex w-full flex-col gap-(--gap-2)">
          <SelectField
            label="발견 일시*"
            onClick={() => setOpenSheet("datetime")}
            placeholder="날짜와 시간을 선택해주세요"
            value={discoveredAt ? formatReportDateTime(discoveredAt) : null}
          />
          <div className="flex w-full flex-col items-end">
            <button
              className="px-(--padding-3) py-(--padding-2) text-caption-medium-mobile text-text-brand underline"
              onClick={() => setDiscoveredAt(new Date())}
              type="button"
            >
              지금으로 설정
            </button>
          </div>
        </div>

        {/* 제보 유형(단일 선택) */}
        <div className="flex w-full flex-col gap-(--gap-2)">
          <span className="text-caption-medium-mobile text-text-tertiary">제보 유형 선택*</span>
          <div className="flex w-full gap-[var(--gap-1)]">
            {REPORT_TYPES.map((type) => (
              <Button
                className="flex-1"
                isSelected={reportType === type}
                key={type}
                onClick={() => setReportType(type)}
                platform="mobile"
                variant="tertiary"
              >
                {REPORT_TYPE_LABEL[type]}
              </Button>
            ))}
          </div>
        </div>

        {/* 개인정보 및 위치정보 동의 */}
        <div className="flex w-full flex-col gap-(--gap-2)">
          <span className="text-caption-medium-mobile text-text-tertiary">
            개인정보 및 위치정보 동의*
          </span>
          <div className="flex flex-col gap-(--gap-1)">
            <ConsentRow
              checked={hasCollectConsent}
              label="사진 및 위치 정보 수집 이용에 동의합니다 (필수)"
              onToggle={() => setHasCollectConsent((prev) => !prev)}
            />
            <ConsentRow
              checked={hasReviewConsent}
              label="제보 내용이 관리자 검수에 활용됨에 동의합니다 (필수)"
              onToggle={() => setHasReviewConsent((prev) => !prev)}
            />
          </div>
        </div>

        <Button
          className="w-full"
          disabled={!canSubmit}
          onClick={handleSubmit}
          platform="mobile"
          variant="primary"
        >
          제출
        </Button>
      </PublicPageShell>

      {isCurrentLocationMapOpen ? (
        <div className="fixed inset-0 z-50 mx-auto flex h-dvh w-full max-w-[430px] flex-col bg-bg-default">
          <CurrentLocationScreen
            onBack={() => setIsCurrentLocationMapOpen(false)}
            onConfirmLocation={(selected) => {
              setLocation({
                name: selected.name,
                address: selected.address,
                point: selected.point,
              });
              setIsCurrentLocationMapOpen(false);
            }}
          />
        </div>
      ) : (
        <>
          <AddressSearchSheet
            onClose={() => setOpenSheet(null)}
            onFindCurrentLocation={() => {
              setOpenSheet(null);
              setIsCurrentLocationMapOpen(true);
            }}
            onSelect={setLocation}
            open={openSheet === "address"}
          />
          <DateTimeSheet
            onClose={() => setOpenSheet(null)}
            onConfirm={(date) => {
              setDiscoveredAt(date);
              setOpenSheet(null);
            }}
            open={openSheet === "datetime"}
            value={discoveredAt}
          />
        </>
      )}
    </>
  );
}
