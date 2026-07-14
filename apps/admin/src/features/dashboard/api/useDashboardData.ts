"use client";

import { useEffect, useState } from "react";
import { clearAdminSession } from "@/features/admin-auth/model/admin-session";
import { ApiError } from "@/shared/api/http-client";
import type { BackendHorizon } from "@/shared/api/types";
import { timeFrameToHorizon } from "@/shared/risk/mappers";
import type { TimeFrame } from "@/shared/risk/types";
import type { BeachSummary, DashboardStat } from "../types";
import { getDashboardSummary, getLatestRisks } from "./dashboard-api";
import { toBeachSummary, toDashboardStats } from "./mappers";

function handleUnauthorized(error: unknown): boolean {
  if (error instanceof ApiError && error.status === 401) {
    clearAdminSession();
    window.location.assign("/login");
    return true;
  }
  return false;
}

export function useDashboardData(timeFrame: TimeFrame | null) {
  const horizon = timeFrameToHorizon(timeFrame);
  const [beaches, setBeaches] = useState<BeachSummary[]>([]);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [timestamp, setTimestamp] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isRisksLoading, setIsRisksLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setIsSummaryLoading(true);
    getDashboardSummary()
      .then((summary) => {
        if (cancelled) return;
        const mapped = toDashboardStats(summary);
        setStats(mapped.stats);
        setTimestamp(mapped.timestamp);
      })
      .catch((error) => {
        if (cancelled) return;
        if (handleUnauthorized(error)) return;
        setIsError(true);
      })
      .finally(() => {
        if (!cancelled) setIsSummaryLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    setIsRisksLoading(true);
    getLatestRisks(horizon)
      .then((items) => {
        if (cancelled) return;
        setBeaches(items.map(toBeachSummary));
      })
      .catch((error) => {
        if (cancelled) return;
        if (handleUnauthorized(error)) return;
        setIsError(true);
      })
      .finally(() => {
        if (!cancelled) setIsRisksLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [horizon]);

  const isLoading = isSummaryLoading || isRisksLoading;

  return { beaches, stats, timestamp, isLoading, isError, horizon: horizon as BackendHorizon };
}
