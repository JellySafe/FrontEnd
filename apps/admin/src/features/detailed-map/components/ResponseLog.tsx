"use client";

import { Fragment, useState } from "react";
import { AdminLargeTextField } from "@/shared/ui/AdminLargeTextField";
import { Chip } from "@jellysafe/design-system";
import { RESPONSE_ACTIONS, RESPONSE_HISTORY } from "../mocks/detailed-map.mock";
import type { ResponseLogEntry } from "../types";
import { ResponseHistoryItem } from "./ResponseHistoryItem";

const SUBMIT_ERROR_MESSAGE =
  "저장을 실패했습니다. 다시 시도해주세요.\n문제가 지속되면 관리자에게 문의해주세요.";

// 대응 기록 작성 폼 + 이력. 서버 저장 없이 로컬 preview로만 동작한다.
// 진입 시 수행한 조치는 항상 미선택 상태다.
export function ResponseLog() {
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [memo, setMemo] = useState("");
  const [history, setHistory] = useState<ResponseLogEntry[]>(RESPONSE_HISTORY);
  const [showActionValidation, setShowActionValidation] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saveAttemptCount, setSaveAttemptCount] = useState(0);

  const trimmed = memo.trim();

  const selectAction = (id: string) => {
    setSelectedActionId((prev) => (prev === id ? null : id));
    setShowActionValidation(false);
    setSubmitError(null);
  };

  const handleSave = () => {
    if (!selectedActionId) {
      setShowActionValidation(true);
      return;
    }

    if (saveAttemptCount === 0) {
      setSaveAttemptCount(1);
      setSubmitError(SUBMIT_ERROR_MESSAGE);
      return;
    }

    // mock/preview: 서버 저장 없이 로컬 이력에만 추가한다. (백엔드 연동 시 실제 저장 API로 교체)
    const action = RESPONSE_ACTIONS.find((item) => item.id === selectedActionId);
    const label = action?.label ?? "대응 기록";
    const entry: ResponseLogEntry = {
      id: `log-${Date.now()}`,
      actionLabel: label,
      savedAt: "방금 저장 (미리보기)",
      actionAt: "-",
      manager: "현재 관리자",
      content: trimmed || label,
      results: [label],
      ...(trimmed ? { memo: trimmed } : {}),
    };
    setHistory((prev) => [entry, ...prev]);
    setSelectedActionId(null);
    setMemo("");
    setSubmitError(null);
    setSaveAttemptCount(0);
    setShowActionValidation(false);
  };

  const fieldState = submitError ? "error" : "default";

  return (
    <div className="flex flex-col gap-(--gap-8) pb-(--padding-10)">
      <section className="flex flex-col gap-(--gap-3)">
        <h2 className="text-heading-xsmall-pc text-text-primary">기록 작성</h2>

        <div className="flex flex-col gap-(--gap-5)">
          <div className="flex flex-col gap-(--gap-2)">
            <p className="text-caption-medium-pc text-text-tertiary">수행한 조치*</p>
            <div className="flex flex-wrap gap-(--gap-2)">
              {RESPONSE_ACTIONS.map((action) => (
                <Chip
                  key={action.id}
                  onSelectedChange={() => selectAction(action.id)}
                  selected={selectedActionId === action.id}
                >
                  {action.label}
                </Chip>
              ))}
            </div>
            {showActionValidation ? (
              <p className="text-caption-small-pc text-text-error">수행한 조치를 선택해주세요</p>
            ) : null}
          </div>

          <AdminLargeTextField
            actionDisabled={!trimmed}
            actionLabel="기록 저장"
            error={submitError ?? undefined}
            label="작성란"
            onAction={handleSave}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="내용을 입력하세요"
            state={fieldState}
            value={memo}
          />
        </div>
      </section>

      <section className="flex flex-col gap-(--gap-3)">
        <h2 className="text-heading-xsmall-pc text-text-primary">이력</h2>
        <div className="flex flex-col gap-(--gap-5)">
          {history.map((entry, index) => (
            <Fragment key={entry.id}>
              {index > 0 ? (
                <div aria-hidden="true" className="h-px w-full bg-border-default" />
              ) : null}
              <ResponseHistoryItem entry={entry} />
            </Fragment>
          ))}
        </div>
      </section>
    </div>
  );
}
