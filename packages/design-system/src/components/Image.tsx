"use client";

import { useState } from "react";
import type { ImgHTMLAttributes } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

// 재시도 아이콘(refresh) path
const REFRESH_PATH =
  "M11.5 4C14.2486 4 16.6749 5.38626 18.1156 7.5H15.5V9.5H21.5V3.5H19.5V5.99936C17.6762 3.57166 14.7724 2 11.5 2C5.97715 2 1.5 6.47715 1.5 12H3.5C3.5 7.58172 7.08172 4 11.5 4ZM19.5 12C19.5 16.4183 15.9183 20 11.5 20C8.75144 20 6.32508 18.6137 4.88443 16.5H7.5V14.5H1.5V20.5H3.5V18.0006C5.32381 20.4283 8.22764 22 11.5 22C17.0228 22 21.5 17.5228 21.5 12H19.5Z";

type ImageStatus = "loading" | "loaded" | "error";

export type ImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "onError" | "onLoad"
> & {
  src: string;
  alt: string;
  loadingLabel?: string;
  errorLabel?: string;
};

// default/loading/error 상태를 가진 이미지 primitive. alt=""면 decorative로 취급.
export function Image({
  src,
  alt,
  loadingLabel = "이미지 불러오는 중...",
  errorLabel = "다시 시도",
  className,
  ...props
}: ImageProps) {
  const [status, setStatus] = useState<ImageStatus>("loading");
  const [reloadKey, setReloadKey] = useState(0);

  const handleRetry = () => {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  };

  return (
    <div
      className={["relative overflow-hidden rounded-lg", className]
        .filter(Boolean)
        .join(" ")}
    >
      <img
        alt={alt}
        className="size-full object-cover"
        key={reloadKey}
        onError={() => setStatus("error")}
        onLoad={() => setStatus("loaded")}
        src={src}
        {...props}
      />
      {status === "loading" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-(--gap-3) bg-bg-surface">
          <span className="text-caption-medium-pc text-text-tertiary">
            {loadingLabel}
          </span>
          <LoadingSpinner size={24} />
        </div>
      ) : null}
      {status === "error" ? (
        <button
          className="absolute inset-0 flex flex-col items-center justify-center gap-(--gap-3) bg-bg-muted text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
          onClick={handleRetry}
          type="button"
        >
          <span className="text-caption-medium-pc">{errorLabel}</span>
          <svg
            aria-hidden="true"
            className="size-(--icon-size-20)"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path d={REFRESH_PATH} fill="currentColor" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
