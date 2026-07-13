"use client";

import Image from "next/image";
import { useEffect } from "react";
import { CloseIcon } from "@/shared/ui/icons";

export type TipOffImagePreviewModalProps = {
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

// 전체 화면 이미지 미리보기. ESC·백드롭·닫기 버튼으로 닫는다.
export function TipOffImagePreviewModal({
  images,
  index,
  onClose,
  onIndexChange,
}: TipOffImagePreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft" && index > 0) {
        onIndexChange(index - 1);
      } else if (event.key === "ArrowRight" && index < images.length - 1) {
        onIndexChange(index + 1);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [index, images.length, onClose, onIndexChange]);

  if (images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        aria-label="미리보기 닫기"
        className="absolute inset-0 bg-[var(--color-alpha-black-50)]"
        onClick={onClose}
        type="button"
      />
      <div className="relative z-10 flex max-h-[90vh] max-w-[90vw] flex-col items-center gap-(--gap-4)">
        <button
          aria-label="닫기"
          className="absolute -top-[40px] right-0 text-icon-inverse focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
          onClick={onClose}
          type="button"
        >
          <CloseIcon className="size-[24px]" />
        </button>
        <div className="relative h-[70vh] w-[70vw] max-w-[900px] overflow-hidden rounded-lg bg-bg-default">
          <Image
            alt={`제보 사진 ${index + 1}`}
            className="object-contain"
            fill
            sizes="70vw"
            src={images[index]}
          />
        </div>
        <p className="text-caption-medium-pc text-text-inverse">
          {index + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
