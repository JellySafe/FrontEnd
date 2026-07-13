"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { MapPoint } from "@/shared/risk/types";

export type SelectedLocation = { name: string; address?: string; point: MapPoint } | null;

type SelectedLocationContextValue = {
  location: SelectedLocation;
  setLocation: (loc: SelectedLocation) => void;
  clearLocation: () => void;
};

const SelectedLocationContext = createContext<SelectedLocationContextValue | null>(null);

export function SelectedLocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<SelectedLocation>(null);

  const setLocation = useCallback((loc: SelectedLocation) => {
    setLocationState(loc);
  }, []);

  const clearLocation = useCallback(() => {
    setLocationState(null);
  }, []);

  const value = useMemo<SelectedLocationContextValue>(
    () => ({ location, setLocation, clearLocation }),
    [location, setLocation, clearLocation],
  );

  return (
    <SelectedLocationContext.Provider value={value}>
      {children}
    </SelectedLocationContext.Provider>
  );
}

export function useSelectedLocation(): SelectedLocationContextValue {
  const context = useContext(SelectedLocationContext);
  if (context === null) {
    throw new Error("useSelectedLocation must be used within a SelectedLocationProvider");
  }
  return context;
}
