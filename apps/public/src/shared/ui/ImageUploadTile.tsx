"use client";

// plus / x 아이콘 path
const PLUS_PATH =
  "M13.0001 10.9997L22.0002 10.9995V12.9995L13.0001 12.9997V21.9996H11.0001V12.9997L2.00004 12.9999L2 10.9999L11.0001 10.9997L11 2.00001L13 2L13.0001 10.9997Z";
const X_PATH =
  "M11.5 10.4445L16.9445 5L18.5 6.55555L13.0555 12L18.5 17.4444L16.9445 18.9999L11.5 13.5555L6.05556 18.9999L4.5 17.4444L9.94444 12L4.5 6.55555L6.05556 5L11.5 10.4445Z";

export type ImageUploadTileProps = {
  imageSrc?: string;
  imageAlt?: string;
  onAdd?: () => void;
  onRemove?: () => void;
  addLabel?: string;
  removeLabel?: string;
  className?: string;
};

// imageSrc 유무로 add 버튼 / 썸네일+삭제 상태를 전환하는 업로드 타일.
export function ImageUploadTile({
  imageSrc,
  imageAlt = "",
  onAdd,
  onRemove,
  addLabel = "이미지 추가",
  removeLabel = "이미지 삭제",
  className,
}: ImageUploadTileProps) {
  if (imageSrc) {
    return (
      <div
        className={["relative size-[100px] overflow-hidden rounded-lg", className]
          .filter(Boolean)
          .join(" ")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={imageAlt}
          className="size-full object-cover"
          src={imageSrc}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-alpha-black-25)] to-transparent to-50%"
        />
        <button
          aria-label={removeLabel}
          className="absolute right-0 top-0 flex size-(--icon-size-24) items-center justify-center text-icon-inverse focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]"
          onClick={onRemove}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="size-(--icon-size-24)"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path d={X_PATH} fill="currentColor" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      aria-label={addLabel}
      className={[
        "flex size-[100px] items-center justify-center rounded-lg bg-bg-surface text-icon-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-brand)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onAdd}
      type="button"
    >
      <svg
        aria-hidden="true"
        className="size-(--icon-size-24)"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path d={PLUS_PATH} fill="currentColor" />
      </svg>
    </button>
  );
}
