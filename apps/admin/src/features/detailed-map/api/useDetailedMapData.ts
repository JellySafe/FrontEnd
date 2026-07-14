"use client";

import { useCallback, useEffect, useState } from "react";
import { clearAdminSession } from "@/features/admin-auth/model/admin-session";
import { ApiError } from "@/shared/api/http-client";
import type { DetailedBeach, ResponseLogEntry } from "../types";
import {
  getAdminBeachRisk,
  getBeachOperationActions,
  getBeachRecommendations,
} from "./detailed-map-api";
import { toDetailedBeach, toResponseLogEntry } from "./mappers";

function parseBeachId(beachIdParam?: string): {
  beachId: number | null;
  isInvalidId: boolean;
} {
  if (beachIdParam === undefined || beachIdParam.trim() === "") {
    return { beachId: null, isInvalidId: true };
  }

  const parsed = Number(beachIdParam);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return { beachId: null, isInvalidId: true };
  }

  return { beachId: parsed, isInvalidId: false };
}

function handleUnauthorized(error: unknown): boolean {
  if (error instanceof ApiError && error.status === 401) {
    clearAdminSession();
    window.location.assign("/login");
    return true;
  }
  return false;
}

export function useDetailedMapData(beachIdParam?: string) {
  const { beachId, isInvalidId } = parseBeachId(beachIdParam);

  const [beach, setBeach] = useState<DetailedBeach | null>(null);
  const [history, setHistory] = useState<ResponseLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(!isInvalidId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);

  const loadHistory = useCallback(async (id: number) => {
    const response = await getBeachOperationActions(id);
    return response.items.map(toResponseLogEntry);
  }, []);

  const loadAll = useCallback(async (id: number) => {
    const [risk, recommendations, actions] = await Promise.all([
      getAdminBeachRisk(id),
      getBeachRecommendations(id),
      getBeachOperationActions(id),
    ]);

    return {
      beach: toDetailedBeach(risk, recommendations),
      history: actions.items.map(toResponseLogEntry),
    };
  }, []);

  useEffect(() => {
    if (isInvalidId || beachId === null) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    setIsLoading(true);
    setIsError(false);

    loadAll(beachId)
      .then(({ beach: nextBeach, history: nextHistory }) => {
        if (cancelled) return;
        setBeach(nextBeach);
        setHistory(nextHistory);
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
  }, [beachId, isInvalidId, loadAll]);

  const refresh = useCallback(() => {
    if (beachId === null) return;

    setIsRefreshing(true);
    setIsError(false);

    loadAll(beachId)
      .then(({ beach: nextBeach, history: nextHistory }) => {
        setBeach(nextBeach);
        setHistory(nextHistory);
      })
      .catch((error) => {
        if (handleUnauthorized(error)) return;
        setIsError(true);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  }, [beachId, loadAll]);

  const reloadHistory = useCallback(() => {
    if (beachId === null) return;

    loadHistory(beachId)
      .then(setHistory)
      .catch((error) => {
        if (handleUnauthorized(error)) return;
      });
  }, [beachId, loadHistory]);

  return {
    beachId,
    beach,
    history,
    isLoading,
    isRefreshing,
    isError,
    isInvalidId,
    refresh,
    reloadHistory,
  };
}
