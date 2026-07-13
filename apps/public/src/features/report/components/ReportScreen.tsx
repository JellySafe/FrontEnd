"use client";

import { useEffect, useState } from "react";
import type { AnalysisResult, SubmittedReport } from "../types";
import { analyzeReport } from "../utils/analyze-report";
import { AnalyzingScreen } from "./AnalyzingScreen";
import { ReportForm } from "./ReportForm";
import { ReportResultScreen } from "./ReportResultScreen";

type ReportStage = "form" | "analyzing" | "result";

// 제보 플로우 오케스트레이션: 폼 → mock AI 분석 → 결과
export function ReportScreen() {
  const [stage, setStage] = useState<ReportStage>("form");
  const [submitted, setSubmitted] = useState<SubmittedReport | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  // "다른 제보 작성하기" 시 폼 상태 초기화용 key
  const [formKey, setFormKey] = useState(0);

  // analyzing 진입 시 분석 실행. 뒤로가기 등으로 이탈하면 결과 무시.
  useEffect(() => {
    if (stage !== "analyzing" || !submitted) return;
    let isCancelled = false;
    analyzeReport(submitted.reportType).then((analysis) => {
      if (isCancelled) return;
      setResult(analysis);
      setStage("result");
    });
    return () => {
      isCancelled = true;
    };
  }, [stage, submitted]);

  const handleSubmit = (report: SubmittedReport) => {
    setSubmitted(report);
    setStage("analyzing");
  };

  const handleReset = () => {
    setSubmitted(null);
    setResult(null);
    setFormKey((key) => key + 1);
    setStage("form");
  };

  return (
    <>
      {/* 분석 중 뒤로가기 시 입력값 유지를 위해 폼은 숨김 처리로 유지 */}
      <div className={stage === "form" ? undefined : "hidden"}>
        <ReportForm key={formKey} onSubmit={handleSubmit} />
      </div>
      {stage === "analyzing" ? <AnalyzingScreen onBack={() => setStage("form")} /> : null}
      {stage === "result" && result && submitted ? (
        <ReportResultScreen
          onReset={handleReset}
          onRetry={() => setStage("analyzing")}
          report={submitted}
          result={result}
        />
      ) : null}
    </>
  );
}
