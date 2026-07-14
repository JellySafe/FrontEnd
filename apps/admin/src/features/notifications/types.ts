import type { RiskLevel } from "@/shared/risk/types";

export type NotificationTab = "compose" | "inbox";

export type NotificationRecipient = "admin" | "operator" | "public";

export type NotificationItem = {
  id: string;
  locationLabel: string;
  title: string;
  body: string;
  createdAt: string;
  risk: RiskLevel;
  isUnread?: boolean;
};

export const RECIPIENT_OPTIONS: { value: NotificationRecipient; label: string }[] = [
  { value: "admin", label: "관리자" },
  { value: "operator", label: "운영자" },
  { value: "public", label: "관광객" },
];
