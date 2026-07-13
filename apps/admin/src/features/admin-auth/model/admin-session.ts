// 프론트 임시 세션. 백엔드 인증 명세 확정 시 쿠키/토큰 방식으로 교체한다.
const SESSION_KEY = "jellysafe-admin-session";

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function setAdminAuthenticated(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
