"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type LikesContextValue = {
  likedIds: Set<string>;
  isLiked: (id: string) => boolean;
  toggleLike: (id: string) => void;
};

const LikesContext = createContext<LikesContextValue | null>(null);

export function LikesProvider({ children }: { children: ReactNode }) {
  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set());

  const toggleLike = useCallback((id: string) => {
    // 불변 갱신: 매번 새 Set을 만들어 상태 교체
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isLiked = useCallback((id: string) => likedIds.has(id), [likedIds]);

  const value = useMemo<LikesContextValue>(
    () => ({ likedIds, isLiked, toggleLike }),
    [likedIds, isLiked, toggleLike],
  );

  return <LikesContext.Provider value={value}>{children}</LikesContext.Provider>;
}

export function useLikes(): LikesContextValue {
  const context = useContext(LikesContext);
  if (context === null) {
    throw new Error("useLikes must be used within a LikesProvider");
  }
  return context;
}
