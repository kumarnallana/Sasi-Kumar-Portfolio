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

export function useIsDesktop(breakpoint = 768) {
  const subscribe = useCallback((onChange: () => void) => {
    const media = window.matchMedia(`(min-width: ${breakpoint}px)`);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [breakpoint]);
  const getSnapshot = useCallback(() => window.matchMedia(`(min-width: ${breakpoint}px)`).matches, [breakpoint]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
