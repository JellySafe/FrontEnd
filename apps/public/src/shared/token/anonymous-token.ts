// 로그인/JWT가 없는 서비스라, 프론트가 익명 식별 토큰을 생성해 localStorage에 보관하고
// 알림·관심·제보 API에 공통으로 사용한다.
// 브라우저 전용 유틸이므로 클라이언트 컴포넌트/훅에서만 호출한다.

export const ANONYMOUS_TOKEN_STORAGE_KEY = "jellysafe:anonymous-token";

// 저장된 익명 토큰을 반환. 없으면 새로 생성해 저장 후 반환.
export function getAnonymousToken(): string {
  // SSR 환경에서는 localStorage에 접근할 수 없어 빈 문자열을 반환한다.
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(ANONYMOUS_TOKEN_STORAGE_KEY);
  if (existing) return existing;

  // UUID는 36자로 백엔드 64자 제한 내에서 안전하다.
  const token = crypto.randomUUID();
  window.localStorage.setItem(ANONYMOUS_TOKEN_STORAGE_KEY, token);
  return token;
}
