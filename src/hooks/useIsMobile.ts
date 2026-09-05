"use client";

import { useState, useEffect } from "react";

/**
 * A centralized hook for detecting mobile viewport (< 768px).
 * Safely handles SSR by returning `null` or a default value initially
 * to prevent hydration flashes, before settling on the real value.
 */
export function useIsMobile(defaultState = false) {
  const [isMobile, setIsMobile] = useState<boolean>(defaultState);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const mql = window.matchMedia("(max-width: 767px)");
    
    // Set initial value
    setIsMobile(mql.matches);

    // Handle updates
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    
    // Modern browsers
    if (mql.addEventListener) {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    } 
    // Fallback for older browsers
    else {
      mql.addListener(handler);
      return () => mql.removeListener(handler);
    }
  }, []);

  // Return null during SSR to avoid hydration flashes where 
  // desktop content mounts briefly before mobile takes over.
  if (!isMounted) return null;

  return isMobile;
}
