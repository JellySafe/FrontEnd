"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/ui/icons";

export type TipOffImageGalleryProps = {
  images: string[];
  onImageClick: (index: number) => void;
};

// Figma: 우하단 pagination (← 1/N →), white10 원형 버튼 + inverse 카운터, 하단 그라데이션.
export function TipOffImageGallery({ images, onImageClick }: TipOffImageGalleryProps) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return (
      <section className="flex flex-col gap-(--gap-3)">
        <h3 className="text-heading-xsmall-pc text-text-primary">사진</h3>
        <div className="flex h-[385px] items-center justify-center rounded-2xl border border-border-default bg-bg-surface">
          <p className="text-caption-small-pc text-text-tertiary">첨부된 사진이 없습니다.</p>
        </div>
      </section>
    );
  }

  const canGoPrev = index > 0;
  const canGoNext = index < images.length - 1;

  return (
    <section className="flex flex-col gap-(--gap-3)">
      <h3 className="text-heading-xsmall-pc text-text-primary">사진</h3>
      <div className="relative h-[385px] w-full overflow-hidden rounded-2xl bg-bg-dark">
        <button
          className="relative h-full w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
          onClick={() => onImageClick(index)}
          type="button"
        >
          <Image
            alt={`제보 사진 ${index + 1}`}
            className="object-cover"
            fill
            sizes="(max-width: 1440px) 50vw, 514px"
            src={images[index]}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-50% to-[var(--color-alpha-black-50)]"
          />
        </button>

        <div className="absolute right-[40px] bottom-[40px] z-10 flex items-center gap-(--gap-3)">
          <button
            aria-label="이전 사진"
            className="flex items-center rounded-full bg-[var(--color-alpha-white-10)] p-(--padding-2) text-icon-inverse disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
            disabled={!canGoPrev}
            onClick={(event) => {
              event.stopPropagation();
              setIndex((prev) => Math.max(0, prev - 1));
            }}
            type="button"
          >
            <ChevronLeftIcon className="size-[24px]" />
          </button>

          <span className="flex items-center gap-[2px] text-center text-text-inverse">
            <span className="text-body-xsmall-pc">{index + 1}</span>
            <span className="text-body-xxsmall-pc">/</span>
            <span className="text-body-xxsmall-pc">{images.length}</span>
          </span>

          <button
            aria-label="다음 사진"
            className="flex items-center rounded-full bg-[var(--color-alpha-white-10)] p-(--padding-2) text-icon-inverse disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
            disabled={!canGoNext}
            onClick={(event) => {
              event.stopPropagation();
              setIndex((prev) => Math.min(images.length - 1, prev + 1));
            }}
            type="button"
          >
            <ChevronRightIcon className="size-[24px]" />
          </button>
        </div>
      </div>
    </section>
  );
}
