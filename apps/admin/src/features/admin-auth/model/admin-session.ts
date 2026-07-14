import type { AdminRole } from "@/shared/api/types";

const SESSION_KEY = "jellysafe-admin-session";

export type AdminSession = {
  accessToken: string;
  userId: number;
  email: string;
  role: AdminRole;
  name: string;
};

function parseSession(raw: string | null): AdminSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AdminSession;
    if (
      typeof parsed.accessToken === "string" &&
      typeof parsed.userId === "number" &&
      typeof parsed.email === "string" &&
      typeof parsed.role === "string" &&
      typeof parsed.name === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return parseSession(sessionStorage.getItem(SESSION_KEY)) !== null;
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  return parseSession(sessionStorage.getItem(SESSION_KEY));
}

export function getAdminAccessToken(): string | null {
  return getAdminSession()?.accessToken ?? null;
}

export function setAdminSession(session: AdminSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
