import { getAdminAccessToken } from "@/features/admin-auth/model/admin-session";
import type { ApiEnvelope, ApiErrorBody } from "./types";

export class ApiError extends Error {
  readonly status: number;
  readonly path: string;
  readonly code?: string;

  constructor(message: string, status: number, path: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
    this.code = code;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function parseApiErrorBody(body: unknown): { message: string; code?: string } | null {
  if (
    typeof body !== "object" ||
    body === null ||
    !("success" in body) ||
    (body as ApiErrorBody).success !== false ||
    !("error" in body)
  ) {
    return null;
  }

  const { error } = body as ApiErrorBody;
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const { code, message } = error;
  if (typeof code !== "string") {
    return null;
  }

  const resolvedMessage = Array.isArray(message)
    ? message.join(", ")
    : typeof message === "string"
      ? message
      : null;

  if (!resolvedMessage) {
    return null;
  }

  return { message: resolvedMessage, code };
}

function throwApiError(
  body: unknown,
  status: number,
  path: string,
  fallbackMessage: string,
): never {
  const parsed = parseApiErrorBody(body);
  if (parsed) {
    throw new ApiError(parsed.message, status, path, parsed.code);
  }
  throw new ApiError(fallbackMessage, status, path);
}

function mergeAuthHeaders(initHeaders?: HeadersInit): Record<string, string> {
  const headers: Record<string, string> = {};
  if (initHeaders) {
    new Headers(initHeaders).forEach((value, key) => {
      headers[key] = value;
    });
  }
  const token = getAdminAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

// 브라우저는 same-origin 상대 경로로 rewrites 프록시를 탄다.
function buildUrl(path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    return suffix;
  }
  if (!BASE_URL) {
    throw new ApiError("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.", 0, path);
  }
  const base = BASE_URL.replace(/\/+$/, "");
  return `${base}${suffix}`;
}

export async function getJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = buildUrl(path);
  const response = await fetch(url, {
    ...init,
    headers: { Accept: "application/json", ...mergeAuthHeaders(init?.headers) },
  });

  const body: unknown = await response.json();

  if (!response.ok) {
    throwApiError(body, response.status, path, `요청 실패 (${response.status})`);
  }

  const envelope = body as ApiEnvelope<T>;
  if (!envelope.success) {
    throwApiError(body, response.status, path, "API가 실패 응답을 반환했습니다.");
  }
  return envelope.data;
}

export async function postJson<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const url = buildUrl(path);
  const isFormData = body instanceof FormData;

  const authHeaders = mergeAuthHeaders(init?.headers);
  const headers = isFormData
    ? { Accept: "application/json", ...authHeaders }
    : { Accept: "application/json", "Content-Type": "application/json", ...authHeaders };

  const response = await fetch(url, {
    method: "POST",
    ...init,
    body: isFormData ? body : JSON.stringify(body),
    headers,
  });

  const responseBody: unknown = await response.json();

  if (!response.ok) {
    throwApiError(responseBody, response.status, path, `요청 실패 (${response.status})`);
  }

  const envelope = responseBody as ApiEnvelope<T>;
  if (!envelope.success) {
    throwApiError(responseBody, response.status, path, "API가 실패 응답을 반환했습니다.");
  }
  return envelope.data;
}
