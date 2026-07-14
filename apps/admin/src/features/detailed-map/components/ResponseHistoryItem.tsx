import { ChevronRightIcon } from "@/shared/ui/icons";
import type { ResponseLogEntry } from "../types";

// 대응 기록 이력 항목. 접기/펼치기는 아직 미구현이라 항상 펼친 상태로만 노출한다.
export function ResponseHistoryItem({ entry }: { entry: ResponseLogEntry }) {
  return (
    <div className="flex flex-col gap-(--gap-5)">
      <div className="flex w-full items-center justify-between gap-(--gap-3)">
        <span className="flex items-center gap-(--gap-2)">
          <span className="inline-flex h-[30px] items-center rounded-lg border border-border-brand bg-bg-default px-(--padding-3) py-(--padding-2) text-caption-small-pc text-text-brand">
            {entry.actionLabel}
          </span>
          <span className="text-caption-small-pc text-text-tertiary">{entry.savedAt}</span>
        </span>
        <ChevronRightIcon className="size-[24px] text-icon-secondary" />
      </div>

      <div className="max-h-[240px] overflow-hidden text-body-xxsmall-pc text-text-primary">
        <p>조치 일시: {entry.actionAt}</p>
        <p>담당자: {entry.manager}</p>
        <p aria-hidden="true">&nbsp;</p>
        <p>조치 내용:</p>
        <p>{entry.content}</p>
        {entry.results.length > 0 ? (
          <>
            <p aria-hidden="true">&nbsp;</p>
            <p>조치 결과</p>
            <ul className="list-disc pl-[24px]">
              {entry.results.map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>
          </>
        ) : null}
        {entry.memo ? (
          <>
            <p>추가 메모</p>
            <p>{entry.memo}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}
