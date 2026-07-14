import type { ApiEnvelope } from "./types";

export class ApiError extends Error {
  readonly status: number;
  readonly path: string;

  constructor(message: string, status: number, path: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    headers: { Accept: "application/json", ...init?.headers },
  });

  if (!response.ok) {
    throw new ApiError(`요청 실패 (${response.status})`, response.status, path);
  }

  const envelope = (await response.json()) as ApiEnvelope<T>;
  if (!envelope.success) {
    throw new ApiError("API가 실패 응답을 반환했습니다.", response.status, path);
  }
  return envelope.data;
}

export async function postJson<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const url = buildUrl(path);
  const isFormData = body instanceof FormData;

  const headers = isFormData
    ? { Accept: "application/json", ...init?.headers }
    : { Accept: "application/json", "Content-Type": "application/json", ...init?.headers };

  const response = await fetch(url, {
    method: "POST",
    ...init,
    body: isFormData ? body : JSON.stringify(body),
    headers,
  });

  if (!response.ok) {
    throw new ApiError(`요청 실패 (${response.status})`, response.status, path);
  }

  const envelope = (await response.json()) as ApiEnvelope<T>;
  if (!envelope.success) {
    throw new ApiError("API가 실패 응답을 반환했습니다.", response.status, path);
  }
  return envelope.data;
}
