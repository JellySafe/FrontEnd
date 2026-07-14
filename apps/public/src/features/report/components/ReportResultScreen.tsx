"use client";

import { useRouter } from "next/navigation";
import { Button } from "@jellysafe/design-system";
import { PUBLIC_APP_MAX_WIDTH_CLASS } from "@/shared/ui/public-layout";
import { REPORT_TYPE_LABEL } from "../types";
import type { AnalysisResult, SubmittedReport } from "../types";
import { formatReportDateTime } from "../utils/format-date-time";
import { CheckCircleIcon, XCircleIcon } from "./icons";

export type ReportResultScreenProps = {
  result: AnalysisResult;
  report: SubmittedReport;
  onRetry: () => void;
  onReset: () => void;
};

// 제보 접수 결과 화면(성공 3종 + 오류, 내비게이션 바 없음)
export function ReportResultScreen({ result, report, onRetry, onReset }: ReportResultScreenProps) {
  const router = useRouter();
  const isError = result.kind === "error";
  // 서버 안내문(guideMessage)을 개행 기준으로 분리해 문단으로 렌더. error에는 안내문 없음.
  const guideMessage = result.kind === "error" ? undefined : result.guideMessage;
  const noticeLines = guideMessage
    ? guideMessage.split("\n").filter((line) => line.trim().length > 0)
    : [];

  return (
    <div className={`flex min-h-dvh flex-col bg-bg-default ${PUBLIC_APP_MAX_WIDTH_CLASS}`}>
      <header className="flex items-center px-(--padding-5) py-(--padding-4)">
        <h1 className="text-heading-small-mobile text-text-primary">제보 접수</h1>
      </header>

      <div className="flex flex-1 flex-col gap-(--gap-5) px-(--padding-5) pt-(--padding-7)">
        {isError ? (
          <XCircleIcon className="size-12 text-text-error" />
        ) : (
          <CheckCircleIcon className="size-12 text-icon-brand" />
        )}

        {isError ? (
          <div className="text-heading-xsmall-mobile text-text-primary">
            <p>제보 접수 중 오류가 발생했습니다.</p>
            <p>다시 시도해 주세요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-(--gap-1)">
            <p className="text-heading-xsmall-mobile text-text-primary">
              제보가 정상적으로 접수됐습니다!
            </p>
            <div className="flex min-w-0 items-center gap-(--gap-2) text-text-tertiary">
              <div className="flex min-w-0 items-center gap-(--gap-1) text-body-xxsmall-mobile">
                <span className="truncate">{report.locationName}</span>
                <span className="shrink-0">({formatReportDateTime(report.discoveredAt)})</span>
              </div>
              <span aria-hidden="true" className="w-px self-stretch bg-border-default" />
              <span className="shrink-0 text-body-xsmall-mobile">
                {REPORT_TYPE_LABEL[report.reportType]}
              </span>
            </div>
          </div>
        )}

        {noticeLines.length > 0 ? (
          <div className="text-body-xxsmall-mobile text-text-secondary">
            {noticeLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ) : null}

        {/* AI 판별 결과 카드(오류 케이스는 카드 미표시) */}
        {isError ? null : (
          <div className="flex w-full flex-col gap-(--gap-2)">
            <div className="flex w-full flex-col gap-(--gap-2) rounded-2xl bg-bg-surface p-(--padding-5)">
              <p className="text-caption-medium-mobile text-text-tertiary">AI 판별 결과</p>
              {result.kind === "general" || result.kind === "toxic" ? (
                <div className="flex flex-col gap-(--gap-1)">
                  <div className="flex items-center gap-(--gap-2) text-body-large-mobile">
                    <span className="text-text-primary">{result.label}</span>
                  </div>
                  {result.confidence !== null ? (
                    <p className="text-caption-small-mobile text-text-tertiary">
                      신뢰도 {result.confidence}%
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-body-large-mobile text-text-primary">판별 불가</p>
              )}
            </div>
            <p className="px-(--padding-5) text-caption-small-mobile text-text-tertiary">
              AI 결과는 참고용이며 관리자 확인 전까지 확정이 아닙니다.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-(--gap-3) px-(--padding-5) pb-(--padding-8)">
        {isError ? (
          <>
            <Button className="w-full" onClick={onRetry} platform="mobile" variant="primary">
              다시 시도
            </Button>
            <Button
              className="w-full"
              onClick={() => router.push("/")}
              platform="mobile"
              variant="secondary"
            >
              홈으로 돌아가기
            </Button>
          </>
        ) : (
          <>
            <Button
              className="w-full"
              onClick={() => router.push("/")}
              platform="mobile"
              variant="primary"
            >
              홈으로 돌아가기
            </Button>
            <Button className="w-full" onClick={onReset} platform="mobile" variant="secondary">
              다른 제보 작성하기
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
