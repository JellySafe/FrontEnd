"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clearAdminSession } from "@/features/admin-auth/model/admin-session";
import { ApiError } from "@/shared/api/http-client";
import type { AdminBeachRiskResponse, BackendHorizon } from "@/shared/api/types";
import { timeFrameToHorizon } from "@/shared/risk/mappers";
import type { TimeFrame } from "@/shared/risk/types";
import type { BeachDetail, BeachSummary, DashboardStat } from "../types";
import { getAdminBeachRisk, getDashboardSummary, getLatestRisks } from "./dashboard-api";
import { enrichBeachSummaries, toBeachDetail, toDashboardStats } from "./mappers";

function handleUnauthorized(error: unknown): boolean {
  if (error instanceof ApiError && error.status === 401) {
    clearAdminSession();
    window.location.assign("/login");
    return true;
  }
  return false;
}

async function fetchRiskForBeaches(
  beachIds: number[],
  cache: Map<number, AdminBeachRiskResponse>,
  onlyMissing: boolean,
): Promise<void> {
  const idsToFetch = onlyMissing ? beachIds.filter((id) => !cache.has(id)) : beachIds;

  if (idsToFetch.length === 0) {
    return;
  }

  const results = await Promise.allSettled(
    idsToFetch.map(async (beachId) => {
      const risk = await getAdminBeachRisk(beachId);
      return { beachId, risk };
    }),
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      cache.set(result.value.beachId, result.value.risk);
    }
  }
}

export function useDashboardData(timeFrame: TimeFrame | null) {
  const horizon = timeFrameToHorizon(timeFrame);
  const riskCacheRef = useRef(new Map<number, AdminBeachRiskResponse>());

  const [beaches, setBeaches] = useState<BeachSummary[]>([]);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [timestamp, setTimestamp] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isRisksLoading, setIsRisksLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);

  const loadBeachesWithCauses = useCallback(
    async (
      targetHorizon: BackendHorizon,
      options: { clearCache?: boolean; onlyMissing?: boolean } = {},
    ) => {
      const { clearCache = false, onlyMissing = true } = options;

      if (clearCache) {
        riskCacheRef.current.clear();
      }

      const items = await getLatestRisks(targetHorizon);
      const beachIds = items.map((item) => item.beachId);

      await fetchRiskForBeaches(beachIds, riskCacheRef.current, onlyMissing);

      return enrichBeachSummaries(items, riskCacheRef.current, targetHorizon);
    },
    [],
  );

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
    loadBeachesWithCauses(horizon, { onlyMissing: true })
      .then((enriched) => {
        if (cancelled) return;
        setBeaches(enriched);
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
  }, [horizon, loadBeachesWithCauses]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setIsError(false);

    Promise.all([
      getDashboardSummary().then((summary) => {
        const mapped = toDashboardStats(summary);
        setStats(mapped.stats);
        setTimestamp(mapped.timestamp);
      }),
      loadBeachesWithCauses(horizon, { clearCache: true, onlyMissing: false }),
    ])
      .then(([, enriched]) => {
        setBeaches(enriched);
      })
      .catch((error) => {
        if (handleUnauthorized(error)) return;
        setIsError(true);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  }, [horizon, loadBeachesWithCauses]);

  const isLoading = isSummaryLoading || isRisksLoading;

  const getBeachDetail = useCallback((beach: BeachSummary): BeachDetail | null => {
    const risk = riskCacheRef.current.get(Number(beach.id));
    if (!risk) return null;
    return toBeachDetail(beach, risk);
  }, []);

  return {
    beaches,
    stats,
    timestamp,
    isLoading,
    isRefreshing,
    isError,
    refresh,
    horizon: horizon as BackendHorizon,
    getBeachDetail,
  };
}
