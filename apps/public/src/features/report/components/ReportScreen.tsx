"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getAnonymousToken } from "@/shared/token/anonymous-token";
import type { AnalysisResult, ReportSubmitPayload, SubmittedReport } from "../types";
import { submitReport, uploadReportImage } from "../api/reports-api";
import { isTerminalStatus, toAnalysisResult, toBackendReportType } from "../api/mappers";
import { useReportResultPolling } from "../api/useReportResultPolling";
import { AnalyzingScreen } from "./AnalyzingScreen";
import { ReportForm } from "./ReportForm";
import { ReportResultScreen } from "./ReportResultScreen";

type ReportStage = "form" | "analyzing" | "result";

// 제보 플로우 오케스트레이션: 폼 → 이미지 업로드 → 제출 → 결과 폴링 → 결과
export function ReportScreen() {
  const [stage, setStage] = useState<ReportStage>("form");
  const [submitted, setSubmitted] = useState<SubmittedReport | null>(null);
  // 업로드/제출 실패(500 등) 시 표시할 오류 결과. 폴링 결과와 별개로 관리.
  const [submitError, setSubmitError] = useState<AnalysisResult | null>(null);
  // 폴링 대상 reportId. 제출 성공 시에만 설정, 그 외 null(폴링 비활성).
  const [pollingReportId, setPollingReportId] = useState<number | null>(null);
  // "다른 제보 작성하기" 시 폼 상태 초기화용 key
  const [formKey, setFormKey] = useState(0);

  // 이미지 업로드 → 제출을 하나의 비동기 흐름으로 처리.
  const submitMutation = useMutation({
    mutationFn: async (payload: ReportSubmitPayload) => {
      const upload = await uploadReportImage(payload.imageFile);
      return submitReport({
        lat: payload.location.point.lat,
        lng: payload.location.point.lng,
        imageUrl: upload.imageUrl,
        // thumbnailUrl은 있을 때만 전달(선택 필드)
        ...(upload.thumbnailUrl ? { thumbnailUrl: upload.thumbnailUrl } : {}),
        reportType: toBackendReportType(payload.reportType),
        occurredAt: payload.discoveredAt.toISOString(),
        // 백엔드 동의 로그 생성 API 부재로 임시 상수값.
        // 추후 실제 consent log 생성 API 연동 시 교체 필요.
        consentLogIds: [1, 2],
        reporterToken: getAnonymousToken(),
      });
    },
  });

  const { reset: resetMutation } = submitMutation;

  const pollingQuery = useReportResultPolling(pollingReportId);

  // 폴링 결과를 렌더 중 파생(효과 내 setState 회피). 종결 상태면 화면용 결과로 변환.
  const pollingData = pollingQuery.data;
  const pollingResult: AnalysisResult | null = pollingQuery.isError
    ? { kind: "error" }
    : pollingData && isTerminalStatus(pollingData.status)
      ? toAnalysisResult(pollingData)
      : null;

  // 최종 표시 결과: 제출 오류가 있으면 우선, 아니면 폴링 결과.
  const displayResult = submitError ?? pollingResult;
  // analyzing 단계에서 결과가 확정되면 결과 화면으로 전환(파생 값 기반).
  const effectiveStage: ReportStage =
    stage === "analyzing" && displayResult ? "result" : stage;

  const handleSubmit = (payload: ReportSubmitPayload) => {
    setStage("analyzing");
    setSubmitError(null);
    submitMutation.mutate(payload, {
      onSuccess: (res) => {
        setSubmitted({
          locationName: payload.locationName,
          discoveredAt: payload.discoveredAt,
          reportType: payload.reportType,
          reportId: res.reportId,
        });
        // 결과 폴링 시작
        setPollingReportId(res.reportId);
      },
      onError: () => {
        // 업로드/제출 실패(500 등)는 조용히 넘기지 않고 오류 결과로 표시.
        setSubmitted({
          locationName: payload.locationName,
          discoveredAt: payload.discoveredAt,
          reportType: payload.reportType,
        });
        setSubmitError({ kind: "error" });
      },
    });
  };

  // 분석 중 뒤로가기(취소): 폼으로 복귀하고 폴링 중단.
  const handleCancelAnalyzing = () => {
    setPollingReportId(null);
    setSubmitError(null);
    resetMutation();
    setStage("form");
  };

  // 오류 화면 "다시 시도": 폼으로 복귀. 중복 제출 방지를 위해 새로 제출하지 않고
  // 숨겨둔 폼에서 사용자가 다시 제출하도록 한다.
  const handleRetry = () => {
    setPollingReportId(null);
    setSubmitError(null);
    resetMutation();
    setStage("form");
  };

  const handleReset = () => {
    setSubmitted(null);
    setSubmitError(null);
    setPollingReportId(null);
    resetMutation();
    setFormKey((key) => key + 1);
    setStage("form");
  };

  return (
    <>
      {/* 분석 중 뒤로가기 시 입력값 유지를 위해 폼은 숨김 처리로 유지 */}
      <div className={effectiveStage === "form" ? undefined : "hidden"}>
        <ReportForm key={formKey} onSubmit={handleSubmit} />
      </div>
      {effectiveStage === "analyzing" ? (
        <AnalyzingScreen onBack={handleCancelAnalyzing} />
      ) : null}
      {effectiveStage === "result" && displayResult && submitted ? (
        <ReportResultScreen
          onReset={handleReset}
          onRetry={handleRetry}
          report={submitted}
          result={displayResult}
        />
      ) : null}
    </>
  );
}
