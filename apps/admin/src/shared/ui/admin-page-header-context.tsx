"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AdminPageHeaderContextValue = {
  pageHeader: ReactNode | null;
  setPageHeader: (header: ReactNode | null) => void;
};

const AdminPageHeaderContext = createContext<AdminPageHeaderContextValue | null>(
  null,
);

export function AdminPageHeaderProvider({ children }: { children: ReactNode }) {
  const [pageHeader, setPageHeaderState] = useState<ReactNode | null>(null);
  const setPageHeader = useCallback((header: ReactNode | null) => {
    setPageHeaderState(header);
  }, []);

  const value = useMemo(
    () => ({ pageHeader, setPageHeader }),
    [pageHeader, setPageHeader],
  );

  return (
    <AdminPageHeaderContext.Provider value={value}>
      {children}
    </AdminPageHeaderContext.Provider>
  );
}

export function useAdminPageHeader() {
  const context = useContext(AdminPageHeaderContext);
  if (!context) {
    throw new Error("useAdminPageHeader must be used within AdminPageHeaderProvider");
  }
  return context;
}
