"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { clearAdminSession } from "@/features/admin-auth/model/admin-session";
import { getLatestRisks } from "@/features/dashboard/api/dashboard-api";
import { ApiError } from "@/shared/api/http-client";
import { buildRiskByBeachId, toTipOffListItem } from "../api/mappers";
import { getAdminReports } from "../api/reports-api";
import {
  EMPTY_TIP_OFF_FILTER,
  countActiveTipOffFilters,
  type AdminStatus,
  type AiVerdict,
  type TipOffFilterState,
  type TipOffListItem,
  type TipOffReportType,
  type TipOffSort,
} from "../types";
import type { RiskLevel } from "@/shared/risk/types";

const RISK_RANK: Record<RiskLevel, number> = {
  safe: 0,
  caution: 1,
  danger: 2,
  critical: 3,
};

function handleUnauthorized(error: unknown): boolean {
  if (error instanceof ApiError && error.status === 401) {
    clearAdminSession();
    window.location.assign("/login");
    return true;
  }
  return false;
}

function matchesFilter(
  item: TipOffListItem,
  filter: TipOffFilterState,
  query: string,
): boolean {
  if (filter.risks.length > 0 && !filter.risks.includes(item.risk)) {
    return false;
  }
  if (filter.reportTypes.length > 0 && !filter.reportTypes.includes(item.reportType)) {
    return false;
  }
  if (filter.aiVerdicts.length > 0 && !filter.aiVerdicts.includes(item.aiVerdict)) {
    return false;
  }
  if (filter.adminStatuses.length > 0 && !filter.adminStatuses.includes(item.adminStatus)) {
    return false;
  }
  const trimmed = query.trim();
  if (trimmed) {
    const haystack = `${item.title} ${item.beach}`.toLowerCase();
    if (!haystack.includes(trimmed.toLowerCase())) {
      return false;
    }
  }
  return true;
}

function sortRows(rows: TipOffListItem[], sort: TipOffSort): TipOffListItem[] {
  return [...rows].sort((a, b) => {
    switch (sort) {
      case "latest":
        return b.receivedAtSort - a.receivedAtSort;
      case "oldest":
        return a.receivedAtSort - b.receivedAtSort;
      case "risk-high": {
        const byRisk = RISK_RANK[b.risk] - RISK_RANK[a.risk];
        return byRisk !== 0 ? byRisk : b.receivedAtSort - a.receivedAtSort;
      }
      case "risk-low": {
        const byRisk = RISK_RANK[a.risk] - RISK_RANK[b.risk];
        return byRisk !== 0 ? byRisk : b.receivedAtSort - a.receivedAtSort;
      }
    }
  });
}

// 목록 검색·정렬·필터 draft/apply 로직을 분리한다.
export function useTipOffListState() {
  const [rows, setRows] = useState<TipOffListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<TipOffSort>("latest");
  const [appliedFilter, setAppliedFilter] = useState<TipOffFilterState>(EMPTY_TIP_OFF_FILTER);
  const [draftFilter, setDraftFilter] = useState<TipOffFilterState>(EMPTY_TIP_OFF_FILTER);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    const [reportsResponse, risks] = await Promise.all([
      getAdminReports({ page: 1, size: 50 }),
      getLatestRisks("now"),
    ]);
    const riskByBeachId = buildRiskByBeachId(risks);
    const mapped = reportsResponse.items.map((item) => toTipOffListItem(item, riskByBeachId));
    return { rows: mapped, totalCount: reportsResponse.total };
  }, []);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    loadReports()
      .then(({ rows: loadedRows, totalCount: loadedTotal }) => {
        if (cancelled) return;
        setRows(loadedRows);
        setTotalCount(loadedTotal);
      })
      .catch((error) => {
        if (cancelled) return;
        if (handleUnauthorized(error)) return;
        setIsError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [loadReports]);

  const refresh = useCallback(() => {
    setIsError(false);
    setIsLoading(true);

    loadReports()
      .then(({ rows: loadedRows, totalCount: loadedTotal }) => {
        setRows(loadedRows);
        setTotalCount(loadedTotal);
      })
      .catch((error) => {
        if (handleUnauthorized(error)) return;
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [loadReports]);

  const visibleRows = useMemo(
    () => sortRows(rows.filter((row) => matchesFilter(row, appliedFilter, query)), sort),
    [rows, appliedFilter, query, sort],
  );

  const previewCount = useMemo(
    () => rows.filter((row) => matchesFilter(row, draftFilter, query)).length,
    [rows, draftFilter, query],
  );

  const toggleFilter = () => {
    if (isFilterOpen) {
      setIsFilterOpen(false);
      return;
    }
    setDraftFilter(appliedFilter);
    setIsFilterOpen(true);
  };

  const toggleRisk = (risk: RiskLevel) =>
    setDraftFilter((prev) => ({
      ...prev,
      risks: prev.risks.includes(risk)
        ? prev.risks.filter((item) => item !== risk)
        : [...prev.risks, risk],
    }));

  const toggleReportType = (reportType: TipOffReportType) =>
    setDraftFilter((prev) => ({
      ...prev,
      reportTypes: prev.reportTypes.includes(reportType)
        ? prev.reportTypes.filter((item) => item !== reportType)
        : [...prev.reportTypes, reportType],
    }));

  const toggleAiVerdict = (aiVerdict: AiVerdict) =>
    setDraftFilter((prev) => ({
      ...prev,
      aiVerdicts: prev.aiVerdicts.includes(aiVerdict)
        ? prev.aiVerdicts.filter((item) => item !== aiVerdict)
        : [...prev.aiVerdicts, aiVerdict],
    }));

  const toggleAdminStatus = (adminStatus: AdminStatus) =>
    setDraftFilter((prev) => ({
      ...prev,
      adminStatuses: prev.adminStatuses.includes(adminStatus)
        ? prev.adminStatuses.filter((item) => item !== adminStatus)
        : [...prev.adminStatuses, adminStatus],
    }));

  const resetDraft = () => setDraftFilter(EMPTY_TIP_OFF_FILTER);

  const applyFilter = () => {
    setAppliedFilter(draftFilter);
    setIsFilterOpen(false);
    setSelectedId(null);
  };

  const updateRowStatus = (id: string, adminStatus: AdminStatus) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, adminStatus } : row)),
    );
  };

  const updateThumbnailState = (
    id: string,
    thumbnailState: TipOffListItem["thumbnailState"],
    thumbnailSrc?: string,
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, thumbnailState, thumbnailSrc: thumbnailSrc ?? row.thumbnailSrc } : row,
      ),
    );
  };

  return {
    rows,
    totalCount,
    isLoading,
    isError,
    refresh,
    query,
    setQuery,
    sort,
    setSort,
    appliedFilter,
    draftFilter,
    isFilterOpen,
    selectedId,
    setSelectedId,
    visibleRows,
    previewCount,
    appliedCount: countActiveTipOffFilters(appliedFilter),
    canReset: countActiveTipOffFilters(draftFilter) > 0,
    toggleFilter,
    toggleRisk,
    toggleReportType,
    toggleAiVerdict,
    toggleAdminStatus,
    resetDraft,
    applyFilter,
    updateRowStatus,
    updateThumbnailState,
  };
}
