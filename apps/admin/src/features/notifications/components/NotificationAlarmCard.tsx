"use client";

import { Badge, Card } from "@jellysafe/design-system";
import { RISK_LABEL, type RiskLevel } from "@/shared/risk/types";
import { CopyIcon } from "@/shared/ui/icons";

const PLACEHOLDER = {
  location: "위치",
  title: "제목",
  body: "상세 설명",
} as const;

export type NotificationAlarmCardProps = {
  locationLabel: string;
  title: string;
  body: string;
  variant: "preview" | "inbox";
  copyActive?: boolean;
  createdAt?: string;
  risk?: RiskLevel;
  onCopy?: () => void;
};

export function NotificationAlarmCard({
  locationLabel,
  title,
  body,
  variant,
  copyActive = false,
  createdAt,
  risk,
  onCopy,
}: NotificationAlarmCardProps) {
  const isPreview = variant === "preview";
  const locationText = locationLabel || PLACEHOLDER.location;
  const titleText = title || PLACEHOLDER.title;
  const bodyText = body || PLACEHOLDER.body;

  const handleCopy = () => {
    void navigator.clipboard.writeText(
      `${locationText}\n${titleText}\n${bodyText}`,
    );
    onCopy?.();
  };

  if (isPreview) {
    return (
      <Card
        className="relative flex flex-col gap-(--gap-2) p-(--padding-5)"
        variant="surface"
      >
        <button
          className={[
            "absolute top-(--padding-5) right-(--padding-5) flex items-center gap-(--gap-1) underline",
            copyActive ? "text-text-brand" : "text-text-disabled",
          ].join(" ")}
          disabled={!copyActive}
          onClick={copyActive ? handleCopy : undefined}
          type="button"
        >
          <CopyIcon className="size-[16px]" />
          복사
        </button>

        <p
          className={[
            "text-body-xsmall-pc",
            locationLabel ? "text-text-secondary" : "text-text-disabled",
          ].join(" ")}
        >
          {locationText}
        </p>
        <h3
          className={[
            "text-heading-xsmall-pc",
            title ? "text-text-primary" : "text-text-disabled",
          ].join(" ")}
        >
          {titleText}
        </h3>
        <p
          className={[
            "whitespace-pre-wrap text-caption-small-pc",
            body ? "text-text-secondary" : "text-text-disabled",
          ].join(" ")}
        >
          {bodyText}
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-(--gap-2) p-(--padding-5)" variant="surface">
      {createdAt ? (
        <p className="text-caption-small-pc text-text-tertiary">{createdAt}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-(--gap-2)">
        {risk ? <Badge status={risk}>{RISK_LABEL[risk]}</Badge> : null}
        <p className="text-body-xsmall-pc text-text-secondary">{locationLabel}</p>
      </div>
      <h3 className="text-heading-xsmall-pc text-text-primary">{title}</h3>
      <p className="whitespace-pre-wrap text-caption-small-pc text-text-secondary">
        {body}
      </p>
    </Card>
  );
}
