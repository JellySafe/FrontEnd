const STORAGE_KEY = "jellysafe.public.alarm-tooltip-dismissed";

/** 알림 탭을 한 번이라도 열었는지(말풍선 영구 숨김) */
export function isAlarmTooltipDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissAlarmTooltip(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // private mode 등 — 무시
  }
}
