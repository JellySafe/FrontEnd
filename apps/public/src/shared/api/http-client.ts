import type { ApiEnvelope } from "./types";

// API 호출 실패를 나타내는 오류. 상태 코드와 엔드포인트를 함께 보관.
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

// base URL. 서버/클라이언트 양쪽에서 NEXT_PUBLIC_ 접두 env로 접근 가능.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// path(/api/... )를 base URL과 결합. 슬래시 중복/누락을 정규화.
function buildUrl(path: string): string {
  if (!BASE_URL) {
    throw new ApiError("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.", 0, path);
  }
  const base = BASE_URL.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

// GET 요청 후 { success, data } 봉투를 언랩. non-2xx이거나 success=false면 ApiError throw.
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
