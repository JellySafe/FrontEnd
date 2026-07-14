const STORAGE_KEY = "jellysafe.public.alarm-tooltip-dismissed";

// 같은 탭 내 dismiss 통지용 구독자 집합(useSyncExternalStore)
const listeners = new Set<() => void>();

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
  // 같은 탭에서 구독 중인 컴포넌트에 변경 통지(storage 이벤트는 동일 탭 미발생)
  for (const listener of listeners) listener();
}

/** useSyncExternalStore용 구독자 등록(다른 탭의 변경은 storage 이벤트로 반영) */
export function subscribeAlarmTooltip(onChange: () => void): () => void {
  listeners.add(onChange);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", handleStorage);
  };
}
