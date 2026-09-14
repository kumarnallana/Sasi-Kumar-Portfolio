"use client";

import { useCallback, useSyncExternalStore } from "react";

export function useIsMobile(breakpoint = 768) {
  const subscribe = useCallback((onChange: () => void) => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [breakpoint]);
  const getSnapshot = useCallback(
    () => window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches,
    [breakpoint],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
