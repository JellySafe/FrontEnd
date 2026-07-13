import { useEffect, useState } from "react";

// 입력값을 지정한 지연(ms) 후에만 갱신해 검색/역지오코딩 호출 빈도를 낮춘다.
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
