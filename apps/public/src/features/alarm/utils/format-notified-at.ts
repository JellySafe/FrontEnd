// createdAt(ISO8601) -> "2026.02.07 21:47" 형태의 표시 문자열.
// report의 formatReportDateTime과 동일 포맷이지만, features간 import 방향이
// 껄끄러워 alarm 내부에 동일 헬퍼를 둔다.
export function formatNotifiedAt(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
