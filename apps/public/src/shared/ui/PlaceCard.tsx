"use client";

import { Badge, Card } from "@jellysafe/design-system";
import type { BadgeStatus } from "@jellysafe/design-system";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { LikeButton } from "./LikeButton";

export type PlaceCardProps = {
  imageSrc: string;
  imageAlt: string;
  status: BadgeStatus;
  statusLabel: ReactNode;
  title: ReactNode;
  address: ReactNode;
  isLiked: boolean;
  onLikeChange: (isLiked: boolean) => void;
  likeLabel: string;
  href?: string;
  className?: string;
};

export function PlaceCard({
  imageSrc,
  imageAlt,
  status,
  statusLabel,
  title,
  address,
  isLiked,
  onLikeChange,
  likeLabel,
  href,
  className,
}: PlaceCardProps) {
  const card = (
    <Card
      className={["w-full overflow-hidden", className].filter(Boolean).join(" ")}
      variant="outlined"
    >
      <div className="relative h-[120px] w-full">
        <Image alt={imageAlt} className="object-cover" fill sizes="50vw" src={imageSrc} />
        {/* Link 내부에서 LikeButton 클릭이 내비게이션을 유발하지 않도록 이벤트 전파 차단 */}
        <span
          className="absolute right-2 bottom-2"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <LikeButton
            aria-label={likeLabel}
            isLiked={isLiked}
            onPressedChange={onLikeChange}
          />
        </span>
      </div>
      <div className="flex flex-col items-start gap-(--gap-3) bg-bg-default px-(--padding-5) pt-(--padding-3) pb-(--padding-5)">
        <Badge platform="mobile" status={status}>
          {statusLabel}
        </Badge>
        <div className="flex w-full flex-col gap-(--gap-2)">
          <p className="w-full truncate text-body-xsmall-mobile text-text-primary">
            {title}
          </p>
          <p className="w-full truncate text-caption-small-mobile text-text-secondary">
            {address}
          </p>
        </div>
      </div>
    </Card>
  );

  if (href) {
    return (
      <Link className="block w-full" href={href}>
        {card}
      </Link>
    );
  }

  return card;
}
